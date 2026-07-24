import { useState } from "react";
import {
  Leaf,
  Flame,
  Droplets,
  TrendingDown,
  Wallet,
  Sparkles,
  Info,
} from "lucide-react";
import { useApp, REDUCTION_PER_RAI_PER_PRACTICE } from "@/context/AppContext";
import { CountUp } from "@/components/CountUp";
import { Toggle } from "@/components/Toggle";

const COST_PER_RAI_TRADITIONAL = 4500; // THB per rai
const SAVING_PER_PRACTICE_PER_RAI = 350; // THB saved per rai per practice

export function DashboardPage() {
  const { farm, setFarm, greenCredits, recomputeCredits } = useApp();
  const [computed, setComputed] = useState(greenCredits);
  const [animKey, setAnimKey] = useState(0);

  const practices = (farm.stopBurning ? 1 : 0) + (farm.awd ? 1 : 0);
  const tco2Reduced = farm.areaRai * practices * REDUCTION_PER_RAI_PER_PRACTICE;
  const costBefore = farm.areaRai * COST_PER_RAI_TRADITIONAL;
  const costAfter = costBefore - farm.areaRai * practices * SAVING_PER_PRACTICE_PER_RAI;
  const thbSaved = costBefore - costAfter;

  const handleCalculate = () => {
    recomputeCredits();
    setComputed(greenCredits);
    setAnimKey((k) => k + 1);
    setTimeout(() => setComputed(greenCredits), 0);
  };

  // live recompute for display
  const liveCredits = Math.round(tco2Reduced * 100);

  return (
    <div className="min-h-full bg-gradient-to-b from-emerald-50 to-amber-50/30">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white px-5 pt-12 pb-8 rounded-b-[2rem]">
        <div className="flex items-center gap-2 mb-1">
          <Leaf size={18} className="animate-float" />
          <span className="text-sm font-medium opacity-90">ฮักสกล เกษตรลดคาร์บอน</span>
        </div>
        <h1 className="text-2xl font-bold font-display">คำนวณ Green Credit</h1>
        <p className="text-sm opacity-80 mt-1">
          กรอกข้อมูลฟาร์ม แล้วดูว่าคุณจะได้รับเครดิตเท่าไหร่
        </p>
      </div>

      <div className="px-5 -mt-4 space-y-4 pb-8">
        {/* Input card */}
        <div className="bg-white rounded-2xl shadow-lg p-5 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              ขนาดพื้นที่ (ไร่)
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                value={farm.areaRai}
                onChange={(e) => setFarm({ areaRai: Number(e.target.value) || 0 })}
                className="w-full text-2xl font-bold text-stone-800 bg-stone-50 rounded-xl px-4 py-3 pr-12 border-2 border-stone-200 focus:border-emerald-500 focus:outline-none transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 font-medium text-sm">
                ไร่
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              {[5, 10, 20, 50].map((n) => (
                <button
                  key={n}
                  onClick={() => setFarm({ areaRai: n })}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    farm.areaRai === n
                      ? "bg-emerald-500 text-white"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {n} ไร่
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Toggle
              checked={farm.stopBurning}
              onChange={(v) => setFarm({ stopBurning: v })}
              label="หยุดเผาตอซัง"
              description="ลดมลพิษ PM2.5 และก๊าซเรือนกระจก"
              icon={<Flame size={20} />}
            />
            <Toggle
              checked={farm.awd}
              onChange={(v) => setFarm({ awd: v })}
              label="นาเปียกสลับแห้ง (ประหยัดน้ำ)"
              description="ลดมีเทน 30-50% และประหยัดน้ำ"
              icon={<Droplets size={20} />}
            />
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            คำนวณเครดิต
          </button>
        </div>

        {/* Result card */}
        <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl shadow-xl p-6 text-white text-center">
          <div className="text-sm font-medium opacity-90 mb-2">Green Credits ที่ได้รับ</div>
          <CountUp
            key={animKey}
            end={liveCredits}
            className="text-5xl font-bold font-display tracking-tight"
          />
          <div className="text-sm opacity-80 mt-2">เครดิต</div>
          <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="opacity-80">ลดการปล่อยก๊าซ</div>
              <div className="font-bold text-lg">{tco2Reduced.toFixed(1)} tCO₂e</div>
            </div>
            <div>
              <div className="opacity-80">เทียบเท่าปลูกต้นไม้</div>
              <div className="font-bold text-lg">{Math.round(tco2Reduced * 16)} ต้น</div>
            </div>
          </div>
        </div>

        {/* Before/After comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
            <TrendingDown size={18} className="text-emerald-600" />
            เปรียบเทียบต้นทุนและการปล่อยก๊าซ
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="text-xs font-medium text-stone-500 mb-2">ปัจจุบัน</div>
              <div className="space-y-2">
                <div>
                  <div className="text-[11px] text-stone-400">ต้นทุน/ปี</div>
                  <div className="font-bold text-stone-700">
                    ฿{costBefore.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-stone-400">การปล่อยก๊าซ</div>
                  <div className="font-bold text-stone-700">
                    {(farm.areaRai * 1.2).toFixed(1)} tCO₂e
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 border-2 border-emerald-300">
              <div className="text-xs font-medium text-emerald-700 mb-2">หลังปรับเปลี่ยน</div>
              <div className="space-y-2">
                <div>
                  <div className="text-[11px] text-emerald-600">ต้นทุน/ปี</div>
                  <div className="font-bold text-emerald-800">
                    ฿{costAfter.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-emerald-600">การปล่อยก๊าซ</div>
                  <div className="font-bold text-emerald-800">
                    {(farm.areaRai * 1.2 - tco2Reduced).toFixed(1)} tCO₂e
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 bg-amber-50 rounded-xl p-3 flex items-center gap-2">
            <Wallet size={18} className="text-amber-600 shrink-0" />
            <div className="text-sm">
              <span className="text-stone-600">ประหยัดได้ </span>
              <span className="font-bold text-amber-700">
                ฿{thbSaved.toLocaleString()}/ปี
              </span>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50/50 rounded-xl p-3 flex items-start gap-2">
          <Info size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-stone-600">
            สูตรคำนวณ: พื้นที่ (ไร่) × จำนวนวิธีการ × {REDUCTION_PER_RAI_PER_PRACTICE} tCO₂e/ไร่ × 100 = Green Credits
          </p>
        </div>
      </div>
    </div>
  );
}
