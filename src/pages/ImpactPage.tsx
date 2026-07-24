import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { GraduationCap, Cpu, Recycle, Database, TrendingUp } from "lucide-react";
import { useEmissions } from "@/hooks/useEmissions";

const SECTOR_COLORS = [
  "#16a34a",
  "#0891b2",
  "#b45309",
  "#65a30d",
  "#d97706",
  "#9333ea",
  "#0ea5e9",
  "#e11d48",
];

export function ImpactPage() {
  const { byDistrict, bySector, total, recordCount, districtCount, sectorCount, loaded } =
    useEmissions();

  if (!loaded) {
    return (
      <div className="min-h-full bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-stone-500">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  const riceShare = bySector.find((s) => s.name.includes("Rice"))?.value ?? 0;
  const ricePercent = ((riceShare / total) * 100).toFixed(0);

  return (
    <div className="min-h-full bg-stone-50">
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white px-5 pt-12 pb-6 rounded-b-[2rem]">
        <h1 className="text-2xl font-bold font-display">ผลกระทบและ SDG</h1>
        <p className="text-sm opacity-80 mt-1">
          ข้อมูลจริงจากจังหวัดสกลนคร
        </p>
      </div>

      <div className="px-5 -mt-3 pb-8 space-y-5">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="รายการข้อมูล" value={recordCount.toLocaleString()} />
          <StatCard label="อำเภอ" value={String(districtCount)} />
          <StatCard label="ภาคส่วน" value={String(sectorCount)} />
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl p-5 text-white">
          <div className="text-sm opacity-90">การปล่อยก๊าซรวมตลอด 3 ปี</div>
          <div className="text-3xl font-bold font-display mt-1">
            {Math.round(total).toLocaleString()}
          </div>
          <div className="text-sm opacity-80 mt-1">tCO₂e (พ.ศ. 2562–2564)</div>
        </div>

        {/* Bar chart by district */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h3 className="font-bold text-stone-800 mb-1">การปล่อยก๊าซตามอำเภอ</h3>
          <p className="text-xs text-stone-500 mb-4">tCO₂e รวม 18 อำเภอ</p>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <BarChart
                data={byDistrict}
                margin={{ top: 5, right: 5, left: -20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe3" vertical={false} />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 9, fill: "#78716c" }}
                  interval={0}
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#78716c" }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(v: number) => [`${v.toLocaleString()} tCO₂e`, "การปล่อยก๊าซ"]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e7e0d3",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart by sector */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h3 className="font-bold text-stone-800 mb-1">การปล่อยก๊าซตามภาคส่วน</h3>
          <p className="text-xs text-stone-500 mb-4">
            ข้าวเป็นสัดส่วนใหญ่ที่ {ricePercent}%
          </p>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={bySector}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={40}
                  paddingAngle={2}
                >
                  {bySector.map((_, i) => (
                    <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => `${v.toLocaleString()} tCO₂e`}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e7e0d3",
                    fontSize: 12,
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 10 }}
                  iconSize={8}
                  layout="horizontal"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SDG cards */}
        <div className="space-y-3">
          <h3 className="font-bold text-stone-800 px-1">ความสอดคล้องกับ SDG</h3>
          <SdgCard
            number="4"
            title="การศึกษาคุณภาพ"
            description="เกษตรกรผ่านการอบรม"
            stat={`${recordCount.toLocaleString()} รายการ`}
            icon={<GraduationCap size={22} />}
            color="#ca8a04"
          />
          <SdgCard
            number="9"
            title="อุตสาหกรรมและนวัตกรรม"
            description="การนำเทคโนโลยีเกษตรอัจฉริยะมาใช้"
            stat={`${districtCount} อำเภอครอบคลุม`}
            icon={<Cpu size={22} />}
            color="#0891b2"
          />
          <SdgCard
            number="12"
            title="การผลิตและบริโภคที่ยั่งยืน"
            description="ลดของเสีย/หยุดเผาตอซัง"
            stat={`ลดได้ ${Math.round(riceShare * 0.3).toLocaleString()} tCO₂e`}
            icon={<Recycle size={22} />}
            color="#16a34a"
          />
        </div>

        <div className="bg-emerald-50 rounded-xl p-4 flex items-start gap-2">
          <Database size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-stone-600">
            ข้อมูลจริงจาก Sakon Nakhon {recordCount.toLocaleString()} รายการ
            เพื่อความโปร่งใสต่อหน่วยงานรัฐ
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-3 text-center">
      <div className="text-lg font-bold text-emerald-700">{value}</div>
      <div className="text-[11px] text-stone-500 mt-0.5">{label}</div>
    </div>
  );
}

function SdgCard({
  number,
  title,
  description,
  stat,
  icon,
  color,
}: {
  number: string;
  title: string;
  description: string;
  stat: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 flex items-center gap-4">
      <div
        className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
        style={{ backgroundColor: color }}
      >
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-stone-800 text-sm">{title}</div>
        <div className="text-xs text-stone-500 mt-0.5">{description}</div>
        <div className="flex items-center gap-1 mt-1.5">
          {icon}
          <span className="text-xs font-semibold" style={{ color }}>
            {stat}
          </span>
        </div>
      </div>
    </div>
  );
}
