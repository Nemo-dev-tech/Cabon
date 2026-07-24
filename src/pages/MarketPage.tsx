import { useState } from "react";
import { Package, Search, MapPin, Calendar, Phone, Tag, Leaf } from "lucide-react";
import { LISTINGS } from "@/data/listings";
import type { MarketListing } from "@/types";
import { useApp } from "@/context/AppContext";
import { Modal } from "@/components/Modal";

export function MarketPage() {
  const [tab, setTab] = useState<"have" | "need">("have");
  const [selected, setSelected] = useState<MarketListing | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [credits, setCredits] = useState(0);
  const { greenCredits } = useApp();

  const filtered = LISTINGS.filter((l) => l.type === tab);

  const maxCredits = Math.min(greenCredits, Math.floor(selected?.price / 50 ?? 0) * 100);
  const discount = Math.floor(credits / 100) * 50;
  const finalPrice = Math.max(0, (selected?.price ?? 0) - discount);

  return (
    <div className="min-h-full bg-stone-50">
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white px-5 pt-12 pb-6 rounded-b-[2rem]">
        <h1 className="text-2xl font-bold font-display">ตลาดของเสียหมุนเวียน</h1>
        <p className="text-sm opacity-80 mt-1">
          แลกเปลี่ยนวัสดุเหลือใช้ทางการเกษตร
        </p>
      </div>

      <div className="px-5 -mt-3 pb-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-1.5 flex gap-1.5 mb-4">
          <button
            onClick={() => setTab("have")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === "have"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-stone-500"
            }`}
          >
            ฉันมีของเหลือใช้
          </button>
          <button
            onClick={() => setTab("need")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === "need"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-stone-500"
            }`}
          >
            ฉันต้องการวัตถุดิบ
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            placeholder="ค้นหาวัสดุ อำเภอ..."
            className="w-full bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm border border-stone-200 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Listings */}
        <div className="space-y-3">
          {filtered.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                setSelected(l);
                setCredits(0);
              }}
              className="w-full bg-white rounded-2xl shadow-sm border border-stone-100 p-4 text-left hover:shadow-md hover:border-emerald-200 transition-all active:scale-[0.99]"
            >
              <div className="flex items-start gap-3">
                <div
                  className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: l.avatarColor }}
                >
                  <Package size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-stone-800 text-sm leading-snug">
                      {l.title}
                    </h3>
                    <span className="shrink-0 font-bold text-emerald-700 text-sm">
                      ฿{l.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {l.amphoe}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {l.date}
                    </span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 bg-stone-100 rounded-lg px-2 py-1 text-xs text-stone-600">
                    <Tag size={11} />
                    {l.material} · {l.weight}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title}
      >
        {selected && (
          <div className="space-y-4">
            <div
              className="w-full h-32 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: selected.avatarColor }}
            >
              <Package size={48} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InfoCell label="วัสดุ" value={selected.material} />
              <InfoCell label="ปริมาณ" value={selected.weight} />
              <InfoCell label="อำเภอ" value={selected.amphoe} />
              <InfoCell label="คุณภาพ" value={selected.quality} />
              <InfoCell label="วันที่ลงประกาศ" value={selected.date} />
              <InfoCell label="ผู้ลงประกาศ" value={selected.user} />
            </div>

            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-stone-700">ราคา</span>
                <span className="text-xl font-bold text-emerald-700">
                  ฿{selected.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Credit redemption slider */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <Leaf size={16} className="text-emerald-600" />
                <span className="text-sm font-semibold text-stone-700">
                  ใช้ Green Credit ลดราคา
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.min(maxCredits, 1000)}
                step={100}
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-stone-500 mt-1">
                <span>0</span>
                <span>ใช้ {credits} เครดิต</span>
                <span>{Math.min(maxCredits, 1000)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-stone-600">
                  ลด {discount} บาท
                </span>
                <span className="text-lg font-bold text-emerald-700">
                  ราคาสุทธิ ฿{finalPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                คุณมีเครดิตสะสม {greenCredits.toLocaleString()} เครดิต
              </p>
            </div>

            <button
              onClick={() => setContactOpen(true)}
              className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Phone size={18} />
              ติดต่อ
            </button>
          </div>
        )}
      </Modal>

      {/* Contact Modal */}
      <Modal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="ติดต่อผู้ลงประกาศ"
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-stone-50 rounded-xl p-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: selected.avatarColor }}
              >
                {selected.user.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-stone-800">{selected.user}</div>
                <div className="text-sm text-stone-500">{selected.amphoe}</div>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-stone-700 mb-2 block">
                ข้อความที่จะส่ง
              </label>
              <textarea
                defaultValue={`สวัสดีครับ สนใจ ${selected.material} ที่ลงประกาศไว้ รบกวนแจ้งรายละเอียดเพิ่มเติมได้ไหมครับ`}
                rows={4}
                className="w-full bg-stone-50 rounded-xl p-3 text-sm border border-stone-200 focus:border-emerald-500 focus:outline-none resize-none"
              />
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <Phone size={24} className="text-emerald-600 mx-auto mb-1" />
              <div className="text-sm text-stone-600">เบอร์โทรศัพท์</div>
              <div className="text-lg font-bold text-stone-800">
                08X-XXX-{selected.id.length === 2 ? "4471" : "2098"}
              </div>
            </div>

            <button className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-emerald-700 active:scale-[0.98] transition-all">
              ส่งข้อความ
            </button>
            <p className="text-xs text-stone-400 text-center">
              *สำหรับการเดโม่ การส่งข้อความเป็นการจำลองการติดต่อ
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-stone-50 rounded-xl p-3">
      <div className="text-xs text-stone-400">{label}</div>
      <div className="text-sm font-semibold text-stone-700 mt-0.5">{value}</div>
    </div>
  );
}
