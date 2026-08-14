import Hero from "@/components/result/Hero";
import UnboxingKit from "@/components/result/UnboxingKit";
import KeyFeatures from "@/components/result/KeyFeatures";
import WhatItCanDo from "@/components/result/WhatItCanDo";
import Warning from "@/components/result/Warning";
import Charging from "@/components/result/Charging";
import Compatible from "@/components/result/Compatible";

export default function ResultPage() {
  return (
    <div className="bg-white">
      <Hero />
      <UnboxingKit />
      <KeyFeatures />
      <WhatItCanDo />
      <Warning />
      <Charging />
      <Compatible />
    </div>
  );
}
