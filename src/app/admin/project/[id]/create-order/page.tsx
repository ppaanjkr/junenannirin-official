"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import SectionBack from "@/components/SectionBack";
import SectionAdminOrderItems from "@/components/admin/order/SectionAdminOrderItems";
import SectionAdminOrderPayment from "@/components/admin/order/SectionAdminOrderPayment";
import { getAdminProjectDetail, getAdminUsers } from "@/lib/api/admin";
import { createAdminOrder } from "@/lib/api/admin-order";
import { useBankList } from "@/hooks/useAdmin";
import { bankOptions } from "@/data/bank";
import Select from "react-select";

type CartSelection = {
  reward_item_id: string;
  item_name: string;
  option_name: string;
  selected_option: string;
  qty: number;
};

type CartLine = {
  id: string;
  name: string;
  price: number;
  qty: number;
  selections: CartSelection[];
};

type UserOption = {
  value: string;
  label: string;
};

export default function Page() {
  const router = useRouter();
  const params = useParams();

  const projectId = String(params.id);

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [cart, setCart] = useState<Record<string, CartLine>>({});
  const [verifySlipEnabled, setVerifySlipEnabled] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [manualTransRef, setManualTransRef] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [popup, setPopup] = useState({
    open: false,
    type: "success",
    message: "",
  });
  const { banks, isBankLoading } = useBankList();
  const bank = useMemo(() => {
    if (!project?.project?.bank_id) {
      return null;
    }
    return (
      banks.find(
        (b: any) => String(b.id) === String(project.project.bank_id),
      ) || null
    );
  }, [banks, project?.project?.bank_id]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const [projectRes, usersRes] = await Promise.all([
        getAdminProjectDetail(projectId),
        getAdminUsers(),
      ]);

      if (projectRes.success) {
        setProject(projectRes.data);
        console.log(projectRes.data);
      }

      if (usersRes.success && Array.isArray(usersRes.data)) {
        setUsers(usersRes.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function verifySlip(file: File) {
    const bank_code = bankOptions.find(
      (b: any) =>
        b.bank_name === bank?.bank_name ||
        b.name === bank?.bank_name ||
        b.bank_short_name === bank?.bank_name,
    )?.code;

    if (!bank_code) {
      throw new Error("Invalid bank");
    }

    const account_no = bank?.account_no?.replace(/-/g, "") ?? "";
    const account_name = bank?.account_name;
    const account_name_en = bank?.account_name_en;

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
      "payload",
      JSON.stringify({
        checkDuplicate: true,
        checkReceiver: [
          {
            accountType: bank_code,
            accountNumber: account_no,
            accountNameTH: account_name,
            accountNameEN: account_name_en,
          },
        ],
      }),
    );

    const res = await fetch(`${process.env.NEXT_PUBLIC_SLIP2GO_API}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SLIP2GO_KEY}`,
      },

      body: formData,
    });

    return res.json();
  }

  const rewards = project?.shop?.rewards || [];

  function addReward(reward: any, selections: CartSelection[]) {
    const key = buildCartKey(reward.id, selections);

    setCart((prev) => {
      const old = prev[key];

      return {
        ...prev,

        [key]: {
          id: reward.id,
          name: reward.title,
          price: Number(reward.price || reward.min_amount || 0),

          qty: Number(old?.qty || 0) + 1,

          selections,
        },
      };
    });
  }

  function removeReward(reward: any, selections: CartSelection[]) {
    const key = buildCartKey(reward.id, selections);

    setCart((prev) => {
      const old = prev[key];

      if (!old) {
        return prev;
      }

      const copy = {
        ...prev,
      };

      if (old.qty <= 1) {
        delete copy[key];

        return copy;
      }

      copy[key] = {
        ...old,
        qty: old.qty - 1,
      };

      return copy;
    });
  }

  function buildCartKey(rewardId: string, selections: CartSelection[]) {
    const optionPart = selections
      .map((s) => `${s.reward_item_id}:${s.option_name}:${s.selected_option}`)
      .sort()
      .join("|");

    return optionPart ? `${rewardId}|${optionPart}` : rewardId;
  }

  const total = useMemo(() => {
    return Object.values(cart).reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
  }, [cart]);

  const count = useMemo(() => {
    return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  async function handleCreateOrder() {
    try {
      if (!selectedUser) {
        throw new Error("Please select customer");
      }

      if (count <= 0) {
        throw new Error("Please select item");
      }

      setLoading(true);

      let referenceId = "";
      let transRef = "";
      let dateTime = new Date().toISOString();
      let amount = total;

      if (verifySlipEnabled) {
        if (!file) {
          throw new Error("Please upload slip");
        }

        const slip = await verifySlip(file);

        const successCode = ["200200", "200000"];

        if (!slip || !successCode.includes(slip.code)) {
          throw new Error(slip?.message || "Invalid slip");
        }

        if (Number(slip.data.amount) < Number(total)) {
          throw new Error("Invalid amount");
        }

        referenceId = slip.data.referenceId || "";
        transRef = slip.data.transRef || "";
        dateTime = slip.data.dateTime || new Date().toISOString();

        amount = Number(slip.data.amount || 0);
      } else {
        if (!manualTransRef.trim()) {
          throw new Error("Transaction Ref is required");
        }
        transRef = manualTransRef.trim();
      }

      const payload = {
        project_id: projectId,
        user_id: selectedUser,
        verify_slip: verifySlipEnabled,
        referenceId,
        transRef,
        dateTime,
        amount,
        admin_note: adminNote,
        items: Object.values(cart).map((line) => ({
          id: line.id,
          name: line.name,
          price: line.price,
          qty: line.qty,
          selections: line.selections.map((s) => ({
            reward_item_id: s.reward_item_id,
            item_name: s.item_name,
            option_name: s.option_name,
            selected_option: s.selected_option,
            qty: Number(s.qty || 1) * Number(line.qty || 1),
          })),
        })),
      };

      const result = await createAdminOrder(payload);

      if (!result.success) {
        throw new Error(result.message || "Create order failed");
      }

      setPopup({
        open: true,
        type: "success",

        message: "Create order success",
      });

      setTimeout(() => {
        router.back();
      }, 1200);
    } catch (err: any) {
      console.error(err);

      setPopup({
        open: true,
        type: "error",

        message: err.message || "Something error",
      });
    } finally {
      setLoading(false);
    }
  }

  const userOptions: UserOption[] = users.map((u: any) => ({
    value: u.uuid,
    label: `${u.username || "-"} (${u.name || "-"})`,
  }));

  return (
    <>
      {(loading || isBankLoading) && <LoadingOverlay />}

      <Popup
        open={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={() =>
          setPopup({
            ...popup,
            open: false,
          })
        }
      />

      <main className="max-w-6xl mx-auto px-6 py-4 pb-24">
        <SectionBack title="Create Order" onclick={() => router.back()} />

        <div className="bg-white border rounded-3xl p-5 mt-4">
          <div className="font-semibold text-lg mb-3">User</div>

          {/* <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option value="">Select User</option>

            {users.map((u) => (
              <option key={u.uuid} value={u.uuid}>
                {u.username || "-"} ({u.name || "-"})
              </option>
            ))}
          </select> */}
          <Select
            options={userOptions}
            placeholder="Search User..."
            value={userOptions.find((x) => x.value === selectedUser) || null}
            onChange={(option) => setSelectedUser(option?.value || "")}
            isSearchable
            styles={{
              control: (base) => ({
                ...base,
                minHeight: 48,
                borderRadius: 12,
              }),
            }}
          />
        </div>

        <div className="mt-5">
          <SectionAdminOrderItems
            rewards={rewards}
            cart={cart}
            addReward={addReward}
            removeReward={removeReward}
          />
        </div>

        <div className="mt-5">
          <SectionAdminOrderPayment
            verifySlip={verifySlipEnabled}
            setVerifySlip={setVerifySlipEnabled}
            file={file}
            setFile={setFile}
            manualTransRef={manualTransRef}
            setManualTransRef={setManualTransRef}
            adminNote={adminNote}
            setAdminNote={setAdminNote}
            total={total}
            loading={loading}
            onSubmit={handleCreateOrder}
          />
        </div>
      </main>
    </>
  );
}
