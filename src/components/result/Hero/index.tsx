import { useNavigate } from "react-router-dom";
import TopBar from "@/components/shared/TopBar";
import Typography from "@/components/shared/Typography";
import Chip from "@/components/shared/Chip";

// ------- Hero UI ------
export default function Hero() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col">
      {/* Top Bar */}
      <TopBar title="장난감 소개서" onBack={handleBack} />

      {/* Content */}
      <div className="flex flex-col items-center gap-6 px-5 py-8">
        {/* Rank Badge */}
        <Chip className="bg-point/20 text-point">상위 4%</Chip>

        {/* Main Title */}
        <div className="text-center">
          <div className="mb-2 text-sm text-gray-07">새벽 2시에도 카톡 폭격하는</div>
          <Typography variant="h1" className="text-gray-09">
            팡이지은
          </Typography>
        </div>

        {/* 3D Image Placeholder */}
        <div className="w-full aspect-square bg-gray-02 rounded-[20px] flex items-center justify-center">
          <span className="text-4xl">🎁</span>
        </div>

        {/* Label Bubbles */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Chip className="bg-white border border-gray-02 text-gray-08">도파민 MAX</Chip>
          <Chip className="bg-white border border-gray-02 text-gray-08">장난꾸러기</Chip>
          <Chip className="bg-white border border-gray-02 text-gray-08">흔자서도 잘놀아요</Chip>
        </div>

        {/* Description */}
        <Typography variant="me2" className="text-center text-gray-07">
          내 장난감 설명서 보러가기
        </Typography>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-2 text-gray-05 animate-bounce">
          <span>∨</span>
        </div>
      </div>
    </div>
  );
}
