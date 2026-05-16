"use client";

import LoadingOverlay from "@/components/LoadingOverlay";
import SectionBack from "@/components/SectionBack";
import MemberCardList from "@/components/setting/member/MemberCardList";
import MemberEditModal from "@/components/setting/member/MemberEditModal";
import MemberFilter from "@/components/setting/member/MemberFilter";
import MemberPagination from "@/components/setting/member/MemberPagination";
import MemberTable from "@/components/setting/member/MemberTable";
import { useUserList } from "@/hooks/useAdmin";
import { teamOptions } from "@/data/teams";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const router = useRouter();

  const { users, isUserLoading } = useUserList();

  const [userRows, setUserRows] = useState<any[]>([]);

  useEffect(() => {
    setUserRows(users || []);
  }, [users]);

  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(1);

  const pageSize = 10;

  const [openModal, setOpenModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleOpenEdit = (user: any) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseEdit = () => {
    setSelectedUser(null);
    setOpenModal(false);
  };

  function handleMemberUpdated(updatedUser: any) {
    setUserRows((prev) =>
      prev.map((u) =>
        String(u.uuid) === String(updatedUser.uuid)
          ? {
              ...u,
              name: updatedUser.name,
              phone: updatedUser.phone,
              address: updatedUser.address,
              team: updatedUser.team,
              active: updatedUser.active ? 1 : 0,
            }
          : u,
      ),
    );

    setSelectedUser(null);
    setOpenModal(false);
  }

  // =========================
  // FILTER
  // =========================

  const filteredUsers = useMemo(() => {
    return userRows.filter((u) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        !search ||
        String(u.name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(u.phone || "").includes(search) ||
        String(u.username || "")
          .toLowerCase()
          .includes(keyword);

      const matchTeam = !teamFilter || u.team === teamFilter;

      const matchStatus =
        !statusFilter || String(Number(u.active)) === String(statusFilter);

      return matchSearch && matchTeam && matchStatus;
    });
  }, [userRows, search, teamFilter, statusFilter]);

  // paging
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const pagedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return (
    <main className="max-w-5xl mx-auto px-6 py-4 md:max-w-3xl lg:max-w-6xl">
      {isUserLoading && <LoadingOverlay />}

      <SectionBack
        onclick={() => router.replace("/admin/setting")}
        title={"Setting Members"}
      />

      <MemberFilter
        search={search}
        setSearch={setSearch}
        teamFilter={teamFilter}
        setTeamFilter={setTeamFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        teams={teamOptions}
        resetPage={() => setPage(1)}
      />

      {/* desktop */}
      <MemberTable users={pagedUsers} onEdit={handleOpenEdit} />

      {/* mobile */}
      <MemberCardList users={pagedUsers} onEdit={handleOpenEdit} />

      {/* empty */}
      {!isUserLoading && filteredUsers.length === 0 && (
        <div className="col-span-12 bg-white border border-pinkAccent rounded-xl shadow-sm p-3 flex justify-center items-center h-[200px] text-sm">
          No Data
        </div>
      )}

      {/* pagination */}
      {filteredUsers.length > 0 && (
        <MemberPagination
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      )}

      <MemberEditModal
        open={openModal}
        user={selectedUser}
        onClose={handleCloseEdit}
        onSaved={handleMemberUpdated}
      />
    </main>
  );
}
