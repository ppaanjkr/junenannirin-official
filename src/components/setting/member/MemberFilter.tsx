"use client";

import { Search } from "lucide-react";

type Props = {
  search: string;
  setSearch: (v: string) => void;

  teamFilter: string;
  setTeamFilter: (v: string) => void;

  statusFilter: string;
  setStatusFilter: (v: string) => void;

  teams: string[];

  resetPage: () => void;
};

export default function MemberFilter({
  search,
  setSearch,

  teamFilter,
  setTeamFilter,

  statusFilter,
  setStatusFilter,

  teams,

  resetPage,
}: Props) {
  return (
    <section className="bg-white rounded-lg border border-pinkAccent shadow-sm p-4 mb-4">
      <div className="grid grid-cols-12 gap-3">

        {/* SEARCH */}
        <div className="col-span-12 md:col-span-6 relative">
          {/* <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-textSub"
          />
          <input
            type="text"
            placeholder="Search name, username or phone"
            value={search}
            onChange={(e) => {
              resetPage();
              setSearch(e.target.value);
            }}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-pinkAccent bg-pinkAccent/10 text-sm focus:outline-none"
          /> */}

          <div className=" flex items-center gap-2 w-full md:w-auto ">
            {/* search */}
            <input
              type="text"
              placeholder="Search..."
              className=" text-sm flex-1 md:w-[280px] border border-pinkAccent rounded-lg px-4 py-2 outline-none "
              value={search}
              onChange={(e) => {
                // setPage(1);
                setSearch(e.target.value);
              }}
            />

            {/* limit */}
            <select
              // value={limit}
              // onChange={(e) => {
              //   setPage(1);
              //   setLimit(Number(e.target.value));
              // }}
              className="text-sm border border-pinkAccent rounded-lg px-3 py-2 outline-none bg-white min-w-[80px] "
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={-1}>All</option>
            </select>
          </div>
        </div>

        {/* TEAM */}
        <div className="col-span-6 md:col-span-3">
          <select
            value={teamFilter}
            onChange={(e) => {
              resetPage();
              setTeamFilter(e.target.value);
            }}
            className="w-full px-3 py-2.5 rounded-xl border border-pinkAccent text-sm bg-white"
          >
            <option value="">All Teams</option>

            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        {/* STATUS */}
        <div className="col-span-6 md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              resetPage();
              setStatusFilter(e.target.value);
            }}
            className="w-full px-3 py-2.5 rounded-xl border border-pinkAccent text-sm bg-white"
          >
            <option value="">All Status</option>

            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
      </div>
    </section>
  );
}