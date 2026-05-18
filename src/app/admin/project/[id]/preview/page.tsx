"use client";

import LoadingOverlay from "@/components/LoadingOverlay";
import Popup from "@/components/ModalPopup";
import SectionContact from "@/components/SectionContact";
import SectionBack from "@/components/SectionBack";
import ActiveProject from "@/components/project/ActiveProject";
import ActiveShop from "@/components/project/ActiveShop";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useProjectDetail } from "@/hooks/useAdmin";
import { useRouter } from "next/navigation";

function buildPreviewData(projectDetail: any) {
  if (!projectDetail?.project) return null;

  const project = projectDetail.project;

  const bank = projectDetail.bank || {
    id: "MOCK_BANK",
    bank_name: "ธนาคารตัวอย่าง",
    bank_short_name: "Bangkok Bank",
    account_name: "Fanclub Preview",
    account_name_en: "Fanclub Preview",
    account_no: "000-0-00000-0",
    qrcode: "",
  };

  const targets =
    projectDetail.targets ||
    projectDetail.donation?.targets ||
    [
      {
        id: "MOCK_TARGET_1",
        project_id: project.id,
        step: 1,
        amount: Number(project.target_amount || 10000),
        title: "Milestone Preview",
        description: "ตัวอย่าง milestone สำหรับตรวจสอบหน้าจอ",
        image_url: project.image_url || "",
        created_at: new Date().toISOString(),
      },
    ];

  const rewards =
    projectDetail.rewards ||
    projectDetail.shop?.rewards ||
    projectDetail.shop?.rewardSummary ||
    projectDetail.donation?.rewards ||
    [
      {
        id: "MOCK_REWARD_1",
        project_id: project.id,
        min_amount: project.type === "shop" ? 350 : 100,
        price: project.type === "shop" ? 350 : 100,
        title: project.type === "shop" ? "Preview Product" : "Preview Reward",
        description: "ตัวอย่างรายการสำหรับตรวจสอบหน้าจอ",
        image_url: project.image_url || "",
        created_at: new Date().toISOString(),
        items: [
          {
            id: "MOCK_RI_1",
            reward_id: "MOCK_REWARD_1",
            item_name: project.type === "shop" ? "Preview Item" : "Reward Item",
            qty: 1,
            has_option: project.type === "shop" ? 1 : 0,
            option_name: project.type === "shop" ? "size" : "",
            active: 1,
            options:
              project.type === "shop"
                ? [
                    {
                      id: "MOCK_RIO_1",
                      reward_item_id: "MOCK_RI_1",
                      option_name: "size",
                      option_value: "S",
                      sort_order: 1,
                      active: 1,
                    },
                    {
                      id: "MOCK_RIO_2",
                      reward_item_id: "MOCK_RI_1",
                      option_name: "size",
                      option_value: "M",
                      sort_order: 2,
                      active: 1,
                    },
                    {
                      id: "MOCK_RIO_3",
                      reward_item_id: "MOCK_RI_1",
                      option_name: "size",
                      option_value: "L",
                      sort_order: 3,
                      active: 1,
                    },
                  ]
                : [],
          },
        ],
      },
    ];

  return {
    // real project data
    project,

    // real if exists, otherwise mock
    bank,
    targets,
    rewards,

    // mock only
    topSpenders: [
      {
        user_id: "MOCK_USER_1",
        name: "Preview User",
        total: 1200,
        count: 2,
      },
      {
        user_id: "MOCK_USER_2",
        name: "Sample User",
        total: 800,
        count: 1,
      },
    ],

    totalDonors: 2,

    recent: [
      {
        id: "MOCK_DONATION_1",
        name: "Preview User",
        amount: 500,
        message: "Preview message",
        created_at: new Date().toISOString(),
      },
      {
        id: "MOCK_DONATION_2",
        name: "Sample User",
        amount: 300,
        message: "",
        created_at: new Date().toISOString(),
      },
    ],

    summary: projectDetail.summary || {
      totalAmount: 0,
      totalOrders: 0,
      totalProjects: 0,
    },

    shop: projectDetail.shop || {
      rewardSummary: rewards.map((reward: any) => ({
        reward_id: reward.id,
        title: reward.title,
        price: Number(reward.price || reward.min_amount || 0),
        image_url: reward.image_url || "",
        qty: 0,
      })),
      itemSummary: rewards.flatMap((reward: any) =>
        (reward.items || []).map((item: any) => ({
          name: item.item_name,
          qty: 0,
        })),
      ),
      sizeSummary: [],
    },

    donation: projectDetail.donation || {
      targets,
      rewards,
      topSpenders: [],
      totalDonors: 0,
      recent: [],
    },
  };
}

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const router = useRouter();

  const { popup, setPopup } = useAuthGuard();

  const { project, isDetailLoading } = useProjectDetail(id);

  const previewData = buildPreviewData(project);

  return (
    <>
      <Popup
        open={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, open: false })}
      />

      <main className="max-w-5xl mx-auto px-6 py-4 md:max-w-3xl">
        {isDetailLoading && <LoadingOverlay />}

        <SectionBack
          onclick={() => router.replace(`/admin/project/${id}`)}
          title="Preview Project"
        />

        <div className="mt-4 rounded-xl border border-pinkAccent bg-pinkAccent/40 px-4 py-3 text-sm text-pinkSecondary">
          Preview mode: หน้านี้สำหรับ admin ตรวจสอบเท่านั้น ทุกปุ่มถูกปิดการใช้งาน
        </div>

        {!isDetailLoading && !previewData && (
          <div className="mt-4 bg-white border border-pinkAccent rounded-xl shadow-sm p-4 text-center text-sm">
            Project not found
          </div>
        )}

        {!isDetailLoading && previewData && (
          <>
            {previewData.project.type === "donation" ? (
              <ActiveProject data={previewData as any} previewMode />
            ) : (
              <ActiveShop data={previewData as any} user={null} previewMode />
            )}
          </>
        )}

        <SectionContact />
      </main>
    </>
  );
}