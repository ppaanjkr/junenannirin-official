import { CircleDollarSign, Heart } from "lucide-react";

export default function SectionSummary() {
  return (
    <section>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-6 lg:col-span-3 bg-white rounded-lg p-4 shadow-soft border border-pinkAccent">
          <div className="flex items-center justify-end">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 flex items-center justify-center text-blue-600">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold mt-3">24</p>
          <p className="text-xs text-ink-500 mt-0.5">โครงการทั้งหมด</p>
        </div>
        <div className="col-span-6 lg:col-span-3 bg-white rounded-lg p-4 shadow-soft border border-pinkAccent">
          <div className="flex items-center justify-end">
            <div className="w-10 h-10 rounded-xl bg-green-100/70 flex items-center justify-center text-green-700">
              <CircleDollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold mt-3">100,000</p>
          <p className="text-xs text-ink-500 mt-0.5">ยอดเงินรวม (บาท)</p>
        </div>
      </div>
    </section>
  );
}
