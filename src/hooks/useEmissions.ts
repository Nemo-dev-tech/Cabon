import { useEffect, useState } from "react";
import Papa from "papaparse";
import type { AggregateItem, EmissionRow } from "@/types";

interface EmissionData {
  rows: EmissionRow[];
  byDistrict: AggregateItem[];
  bySector: AggregateItem[];
  byYear: AggregateItem[];
  total: number;
  recordCount: number;
  districtCount: number;
  sectorCount: number;
  loaded: boolean;
}

const EMPTY: EmissionData = {
  rows: [],
  byDistrict: [],
  bySector: [],
  byYear: [],
  total: 0,
  recordCount: 0,
  districtCount: 0,
  sectorCount: 0,
  loaded: false,
};

function aggregate(rows: EmissionRow[], key: keyof EmissionRow): AggregateItem[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const k = String(r[key]);
    map.set(k, (map.get(k) ?? 0) + (r.emission_tCO2e || 0));
  }
  return Array.from(map, ([name, value]) => ({ name, value })).sort(
    (a, b) => b.value - a.value
  );
}

export function useEmissions(): EmissionData {
  const [data, setData] = useState<EmissionData>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    Papa.parse<EmissionRow>("/sakon_emissions.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (cancelled) return;
        const rows = results.data.filter(
          (r) => r && r.amphoe && typeof r.emission_tCO2e === "number"
        ) as EmissionRow[];
        const total = rows.reduce((s, r) => s + (r.emission_tCO2e || 0), 0);
        setData({
          rows,
          byDistrict: aggregate(rows, "amphoe"),
          bySector: aggregate(rows, "sector"),
          byYear: aggregate(rows, "year_be"),
          total,
          recordCount: rows.length,
          districtCount: new Set(rows.map((r) => r.amphoe)).size,
          sectorCount: new Set(rows.map((r) => r.sector)).size,
          loaded: true,
        });
      },
      error: () => {
        if (!cancelled) setData((d) => ({ ...d, loaded: true }));
      },
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
