import { Donation } from "@/lib/api/types";
import { formatThaiDateWithTime } from "@/lib/formatThaiDate";
import { formatTHB } from "@/lib/formatTHB";

type Theme = {
  secondary: string;
  accent: string;
};
export default function SectionLastDonate({
  data,
  theme,
}: {
  data: Donation[];
  theme: Theme;
}) {
  return (
    <section className="col-span-12 md:col-span-6">
      <div className="flex justify-between items-center mt-6">
        <span className="text-xl font-semibold">Recent Loves</span>
      </div>
      <div>
        <div className="grid grid-col-12 gap-4">
          <div
            className="h-[320px] overflow-y-auto bg-white shadow-sm rounded-xl"
            style={{
              borderColor: `${theme.accent}`,
            }}
          >
            {data.length === 0 && (
              <div className="flex h-full justify-center items-center py-5 text-sm font-semibold">
                be the first!
              </div>
            )}
            {data.map((item, index) => {
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-3 py-3 px-4"
                  style={{
                    borderTop:
                      index !== 0 ? `1px dashed ${theme.secondary}30` : "none",
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>

                    <p
                      className="text-xs"
                      style={{ color: `${theme.secondary}80` }}
                    >
                      {formatThaiDateWithTime(item.created_at)}
                    </p>
                  </div>

                  <div
                    className="font-semibold"
                    style={{ color: theme.secondary }}
                  >
                    {formatTHB(item.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
