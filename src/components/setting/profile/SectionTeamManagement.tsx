import { Pencil, Plus, Trash } from "lucide-react";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import { driveThumb } from "@/lib/workUtils";

type Props = {
  teams: any[];
  onCreate: () => void;
  onEdit: (team: any) => void;
  onDelete: (team: any) => void;
};
export default function SectionSystemSetting({
  teams,
  onCreate,
  onEdit,
  onDelete,
}: Props) {
  return (
    <section className="mt-4">
      <div className="bg-white rounded-lg p-4 shadow-soft border border-pinkAccent">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-pinkSecondary rounded-full"></span>
            Teams
          </h2>
          <button
            className="flex justify-center items-center gap-2 px-3 py-2 rounded-full bg-pinkAccent text-xs text-pinkSecondary hover:bg-pinkSecondary hover:text-pinkAccent"
            onClick={onCreate}
          >
            <Plus className="w-3 h-3" /> New Team
          </button>
        </div>
        {teams && teams.length > 0 ? (
          <div className="grid grid-cols-12 gap-4 mt-2">
            {teams.map((team) => (
              <div
                key={team.value}
                className="col-span-12 md:col-span-6 bg-white rounded-xl p-4 border border-pinkAccent flex justify-between items-center"
              >
                <div className="flex justify-center items-center gap-4">
                  <ImagePreviewModal
                    src={
                      team.image_url
                        ? driveThumb(team.image_url)
                        : "/icon/june_logo_circle.png"
                    }
                    className="w-10 h-10 md:w-14 md:h-14 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm md:text-base">{team.label}</span>

                    {/* <span className="text-xs text-sub">{team.value}</span> */}

                    {/* <span className="text-xs text-sub">
                      Members: {team.member_count || 0}
                    </span> */}
                    <div className="flex flex-row items-end gap-1 ">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          team.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {team.active ? "Active" : "Inactive"}
                      </span>

                      {team.show_in_register && (
                        <span className="text-xs px-2 py-1 rounded-full bg-pinkAccent text-pinkSecondary">
                          Register
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex justify-center items-center hover:text-pinkSecondary"
                    onClick={() => onEdit(team)}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="flex justify-center items-center hover:text-pinkSecondary"
                    onClick={() => onDelete(team)}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-2 w-full bg-white border border-pinkAccent rounded-xl shadow-sm p-3 flex justify-center items-center h-[200px] text-sm">
            No Data
          </div>
        )}
      </div>
    </section>
  );
}
