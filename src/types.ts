export interface EmissionRow {
  record_id: number;
  year_be: number;
  month: number;
  amphoe: string;
  sector: string;
  scope: number;
  activity_data: number;
  activity_unit: string;
  emission_tCO2e: number;
}

export interface AggregateItem {
  name: string;
  value: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
}

export interface UserProfile {
  name: string;
  amphoe: string;
  farmSize: number;
}

export interface FarmInputs {
  areaRai: number;
  stopBurning: boolean;
  awd: boolean;
}

export interface MarketListing {
  id: string;
  type: "have" | "need";
  title: string;
  material: string;
  weight: string;
  amphoe: string;
  quality: string;
  date: string;
  price: number;
  user: string;
  avatarColor: string;
}
