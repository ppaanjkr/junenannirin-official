import { ProfileSummary } from "@/lib/api/types";
import { formatAmount } from "@/lib/formatAmountK";

type Props = {
  user: any;
  className?: string;
  profile?: ProfileSummary | null
};

export default function SectionProfile({
  user,
  className = "",
  profile
}: Props) {
  let image = "/icon/june_logo_circle.png";
  if(user){
    if(user.team === "JuneMeaw"){
        image = "/teams/JuneMeaw.jpg";
    }else if(user.team === "PNan"){
        image = "/teams/PNan.png";
    }else if(user.team === "JuneLookchinMoodeng"){
        image = "/teams/JuneLookchinMoodeng.png";
    }else if(user.team === "admin"){
        image = "/icon/june_logo_circle.png";
    }
  }

  return (
    <section className={className}>
      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5 md:p-6 h-full">
        <div className="flex flex-col items-center text-center md:text-left">
          <div className="relative">
            <img
              src={image}
              alt="avatar"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover ring-4 ring-pinkAccent"
            />
          </div>

          <h2 className="mt-4 text-lg md:text-xl font-semibold">
            {user?.username || "-"}
          </h2>
        </div>

        {/* Mini Stats */}
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-pinkAccent/50 py-3">
            <div className="font-semibold text-pink-500">{profile?.totalProjects || "-"}</div>
            <div className="text-sm text-secondary">Projects</div>
          </div>

          <div className="rounded-xl bg-pink-50 py-3">
            <div className="font-semibold text-pink-500">{profile?.totalOrders || "-"}</div>
            <div className="text-sm text-secondary">Orders</div>
          </div>

          <div className="rounded-xl bg-pink-50 py-3">
            <div className="font-semibold text-pink-500">{profile?.totalAmount ? formatAmount(profile?.totalAmount || 0) : "-"}</div>
            <div className="text-sm text-secondary">Spender</div>
          </div>
        </div>
      </div>
    </section>
  );
}
