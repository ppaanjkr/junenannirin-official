"use client";

import LoadingOverlay from "@/components/LoadingOverlay";
import SectionBack from "@/components/SectionBack";
import MemberCardList from "@/components/setting/member/MemberCardList";
import MemberEditModal from "@/components/setting/member/MemberEditModal";
import MemberFilter from "@/components/setting/member/MemberFilter";
import MemberPagination from "@/components/setting/member/MemberPagination";
import MemberTable from "@/components/setting/member/MemberTable";
import { useUserList } from "@/hooks/useAdmin";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function Page() {
  const router = useRouter();

  const { users, isUserLoading } = useUserList();

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

  // =========================
  // FILTER
  // =========================

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.includes(search) ||
        u.username?.toLowerCase().includes(search.toLowerCase());

      const matchTeam = !teamFilter || u.team === teamFilter;

      const matchStatus = !statusFilter || String(u.active) === statusFilter;

      return matchSearch && matchTeam && matchStatus;
    });
  }, [users, search, teamFilter, statusFilter]);

  // =========================
  // PAGING
  // =========================

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const pagedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const teams = [...new Set(users.map((u) => u.team).filter(Boolean))];

  return (
    <main className="max-w-5xl mx-auto px-6 py-4 md:max-w-3xl">
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
        teams={teams}
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
      />
    </main>
  );
}
