import Hero from "@/components/result/hero";
import UnboxingKit from "@/components/result/unboxingKit";
import KeyFeatures from "@/components/result/keyFeatures";
import WhatItCanDo from "@/components/result/whatItCanDo";
import Warning from "@/components/result/warning";
import Charging from "@/components/result/charging";
import Compatible from "@/components/result/compatible";

export default function ResultPage() {
  return (
    <div className="bg-white">
      <Hero title="팽이 지은" subtitle="새벽 2시에도 카톡 폭격하는" />
      <UnboxingKit />
      <KeyFeatures />
      <WhatItCanDo />
      <Warning />
      <Charging />
      <Compatible />
    </div>
  );
}
