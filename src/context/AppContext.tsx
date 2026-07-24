import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { ChatMessage, FarmInputs, UserProfile } from "@/types";

const REDUCTION_PER_RAI_PER_PRACTICE = 0.1; // tCO2e per rai per enabled practice
export const CREDIT_MULTIPLIER = 100; // Green Credits = tCO2e reduced * 100

interface AppState {
  farm: FarmInputs;
  setFarm: (f: Partial<FarmInputs>) => void;
  greenCredits: number;
  recomputeCredits: () => void;
  profile: UserProfile;
  setProfile: (p: Partial<UserProfile>) => void;
  messages: ChatMessage[];
  addMessage: (m: ChatMessage) => void;
}

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEY = "sakon-farm-state-v1";

function loadPersisted(): {
  farm?: FarmInputs;
  credits?: number;
  profile?: UserProfile;
} {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const persisted = loadPersisted();

  const [farm, setFarmState] = useState<FarmInputs>(
    persisted.farm ?? { areaRai: 10, stopBurning: false, awd: false }
  );
  const [greenCredits, setGreenCredits] = useState<number>(
    persisted.credits ?? 0
  );
  const [profile, setProfileState] = useState<UserProfile>(
    persisted.profile ?? {
      name: "สมชาย ใจดี",
      amphoe: "เมืองสกลนคร",
      farmSize: 15,
    }
  );
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "bot",
      text: "สวัสดีครับ ผมหมอข้าว ผู้ช่วยด้านการเกษตรลดคาร์บอนของจังหวัดสกลนคร มีอะไรให้ช่วยไหมครับ?",
    },
  ]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ farm, credits: greenCredits, profile })
    );
  }, [farm, greenCredits, profile]);

  const setFarm = (f: Partial<FarmInputs>) =>
    setFarmState((prev) => ({ ...prev, ...f }));

  const setProfile = (p: Partial<UserProfile>) =>
    setProfileState((prev) => ({ ...prev, ...p }));

  const recomputeCredits = () => {
    const practices = (farm.stopBurning ? 1 : 0) + (farm.awd ? 1 : 0);
    const reduced = farm.areaRai * practices * REDUCTION_PER_RAI_PER_PRACTICE;
    setGreenCredits(Math.round(reduced * CREDIT_MULTIPLIER));
  };

  const addMessage = (m: ChatMessage) =>
    setMessages((prev) => [...prev, m]);

  return (
    <AppContext.Provider
      value={{
        farm,
        setFarm,
        greenCredits,
        recomputeCredits,
        profile,
        setProfile,
        messages,
        addMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export { REDUCTION_PER_RAI_PER_PRACTICE };
