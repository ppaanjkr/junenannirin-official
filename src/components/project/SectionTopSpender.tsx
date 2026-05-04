import { TopSpender } from "@/lib/api/types";
import { formatTHB } from "@/lib/formatTHB";

type Theme = {
  secondary: string;
  accent: string;
};

export default function SectionTopSpender({
  data,
  theme,
}: {
  data: TopSpender[];
  theme: Theme;
}) {
  return (
    <section className="col-span-12 md:col-span-6">
      <div className="flex justify-between items-center mt-6">
        <span className="text-xl font-semibold">Top Supporters</span>
      </div>
      <div>
        <div className="grid grid-col-12 gap-4">
          <div
            className="h-[320px] overflow-y-auto bg-white shadow-sm rounded-xl"
            style={{
              borderColor: `${theme.accent}`,
            }}
          >
            {data.length === 0 && <div className="flex h-full justify-center items-center py-5 text-sm font-semibold">be the first!</div>}
            {data.map((item, index) => {
              const rank = index + 1;

              const isTop3 = rank <= 3;

              return (
                <div
                  key={item.name}
                  className="flex items-center gap-3 py-3 px-2"
                  style={{
                    borderTop:
                      index !== 0 ? `1px dashed ${theme.secondary}30` : "none",
                  }}
                >
                  {/* Rank */}
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-xl font-bold`}
                    style={
                      isTop3
                        ? {
                            background: theme.accent,
                            color: theme.secondary,
                          }
                        : {
                            color: theme.secondary,
                          }
                    }
                  >
                    {rank}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>

                    <p
                      className="text-xs"
                      style={{ color: `${theme.secondary}80` }}
                    >
                      {item.count} donations
                    </p>
                  </div>

                  {/* Amount */}
                  <div
                    className="font-semibold"
                    style={{ color: theme.secondary }}
                  >
                    {formatTHB(item.total)}
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
