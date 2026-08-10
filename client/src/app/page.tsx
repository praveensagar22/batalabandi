'use client';

import { useState } from "react";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import HeroBanner from "@/components/HeroBanner";
import ShopByArt from "@/components/ShopByArt";
import TrendingNow from "@/components/TrendingNow";
import TrustFeatures from "@/components/TrustFeatures";
import CategoryTabContent from "@/components/CategoryTabContent";
import BottomNav from "@/components/BottomNav";
import DesktopLayout from "@/components/DesktopLayout";

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <>
      {/* ===== MOBILE LAYOUT (< 768px) ===== */}
      <div className="block md:hidden">
        <div className="min-h-screen bg-white">
          <Header activeTab={activeTab} />
          <FilterBar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Connected full-bleed tab content area */}
          <div className="bg-white min-h-[450px]">
            {activeTab === "all" ? (
              <main>
                <HeroBanner />
                <ShopByArt onTabChange={setActiveTab} />
                <TrendingNow />
                <TrustFeatures />
              </main>
            ) : (
              <main>
                <CategoryTabContent activeTab={activeTab} onBackToAll={() => setActiveTab("all")} />
              </main>
            )}
          </div>

          <div className="pb-16" />
          <BottomNav />
        </div>
      </div>

      {/* ===== DESKTOP LAYOUT (>= 768px) ===== */}
      <div className="hidden md:block">
        <DesktopLayout />
      </div>
    </>
  );
}
