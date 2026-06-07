type Props = {
  search: string;
  setSearch: (value: string) => void;
  teamFilter: string;
  setTeamFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  teams: any[];
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
    <div className="bg-white rounded-xl border border-pinkAccent p-3 shadow-sm mt-4 grid grid-cols-12 gap-2">
      <div className="col-span-12 md:col-span-5">
        <input
          value={search}
          onChange={(e) => {
            resetPage();
            setSearch(e.target.value);
          }}
          placeholder="Search name, username, phone..."
          className="w-full border border-pinkAccent rounded-lg px-3 py-2 outline-none text-sm"
        />
      </div>

      <div className="col-span-6 md:col-span-4">
        <select
          value={teamFilter}
          onChange={(e) => {
            resetPage();
            setTeamFilter(e.target.value);
          }}
          className="w-full border border-pinkAccent rounded-lg px-3 py-2 outline-none text-sm bg-white"
        >
          <option value="">All Teams</option>

          {teams.map((team) => (
            <option key={team.value} value={team.value}>
              {team.label}
            </option>
          ))}
        </select>
      </div>

      <div className="col-span-6 md:col-span-3">
        <select
          value={statusFilter}
          onChange={(e) => {
            resetPage();
            setStatusFilter(e.target.value);
          }}
          className="w-full border border-pinkAccent rounded-lg px-3 py-2 outline-none text-sm bg-white"
        >
          <option value="">All Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
      </div>
    </div>
  );
}