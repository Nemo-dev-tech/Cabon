import { HashRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { BottomNav } from "@/components/BottomNav";
import { DashboardPage } from "@/pages/DashboardPage";
import { MarketPage } from "@/pages/MarketPage";
import { ImpactPage } from "@/pages/ImpactPage";
import { ChatbotPage } from "@/pages/ChatbotPage";
import { ProfilePage } from "@/pages/ProfilePage";

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="max-w-md mx-auto min-h-screen bg-stone-50 shadow-xl relative">
          <div className="pb-16 h-screen flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/market" element={<MarketPage />} />
                <Route path="/impact" element={<ImpactPage />} />
                <Route path="/chatbot" element={<ChatbotPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </div>
            <BottomNav />
          </div>
        </div>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
