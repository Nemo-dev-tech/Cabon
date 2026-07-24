import { useState } from "react";
import {
  User,
  MapPin,
  Ruler,
  ChevronDown,
  Droplets,
  Recycle,
  Flame,
  Leaf,
  Award,
  Save,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { TIPS } from "@/data/tips";

const AMPHOE_LIST = [
  "เมืองสกลนคร","กุสุมาลย์","คำตากล้า","ค้อวัง","นิคมน้ำอูน","บ้านม่วง",
  "พรรณานิคม","พังโคน","ภูพาน","วานรนิวาส","วาริชภูมิ","ส่องดาว",
  "สว่างแดนดิน","อากาศอำนวย","เจริญศิลป์","เต่างอย","โคกศรีสุพรรณ","โพนนาแก้ว",
];

const ICON_MAP: Record<string, React.ReactNode> = {
  Droplets: <Droplets size={20} />,
  Recycle: <Recycle size={20} />,
  Flame: <Flame size={20} />,
};

export function ProfilePage() {
  const { profile, setProfile, greenCredits, farm } = useApp();
  const [saved, setSaved] = useState(false);
  const [openTip, setOpenTip] = useState<string | null>("awd");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-full bg-stone-50">
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white px-5 pt-12 pb-6 rounded-b-[2rem]">
        <h1 className="text-2xl font-bold font-display">โปรไฟล์และเคล็ดลับ</h1>
        <p className="text-sm opacity-80 mt-1">ข้อมูลส่วนตัวและความรู้การเกษตร</p>
      </div>

      <div className="px-5 -mt-3 pb-8 space-y-5">
        {/* Credit badge */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <Award size={28} />
          </div>
          <div>
            <div className="text-sm opacity-90">Green Credits สะสม</div>
            <div className="text-3xl font-bold font-display">
              {greenCredits.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Profile form */}
        <div className="bg-white rounded-2xl shadow-lg p-5 space-y-4">
          <h3 className="font-bold text-stone-800">ข้อมูลเกษตรกร</h3>

          <div>
            <label className="text-xs font-medium text-stone-500 mb-1.5 flex items-center gap-1">
              <User size={14} /> ชื่อ
            </label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ name: e.target.value })}
              className="w-full bg-stone-50 rounded-xl px-4 py-2.5 text-sm border border-stone-200 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 mb-1.5 flex items-center gap-1">
              <MapPin size={14} /> อำเภอ
            </label>
            <select
              value={profile.amphoe}
              onChange={(e) => setProfile({ amphoe: e.target.value })}
              className="w-full bg-stone-50 rounded-xl px-4 py-2.5 text-sm border border-stone-200 focus:border-emerald-500 focus:outline-none"
            >
              {AMPHOE_LIST.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 mb-1.5 flex items-center gap-1">
              <Ruler size={14} /> ขนาดฟาร์ม (ไร่)
            </label>
            <input
              type="number"
              min={0}
              value={profile.farmSize}
              onChange={(e) => setProfile({ farmSize: Number(e.target.value) || 0 })}
              className="w-full bg-stone-50 rounded-xl px-4 py-2.5 text-sm border border-stone-200 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {saved ? "บันทึกแล้ว!" : "บันทึกข้อมูล"}
          </button>
        </div>

        {/* Tips */}
        <div className="space-y-3">
          <h3 className="font-bold text-stone-800 px-1 flex items-center gap-2">
            <Leaf size={18} className="text-emerald-600" />
            เคล็ดลับการเกษตรลดคาร์บอน
          </h3>
          {TIPS.map((tip) => {
            const open = openTip === tip.id;
            return (
              <div
                key={tip.id}
                className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenTip(open ? null : tip.id)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    {ICON_MAP[tip.icon] ?? <Leaf size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-stone-800 text-sm">{tip.title}</div>
                    <div className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                      {tip.summary}
                    </div>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-stone-400 shrink-0 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open && (
                  <div className="px-4 pb-4 pt-1 anim-fade-in">
                    <div className="bg-emerald-50/50 rounded-xl p-3">
                      <p className="text-xs text-stone-600 mb-3">{tip.summary}</p>
                      <ol className="space-y-2">
                        {tip.steps.map((step, i) => (
                          <li key={i} className="flex gap-2.5 text-sm text-stone-700">
                            <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center mt-0.5">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
