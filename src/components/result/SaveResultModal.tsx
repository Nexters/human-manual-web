import Typography from "@/components/shared/Typography";

type SaveResultModalProps = {
  onLogin: () => void;
  onSkip: () => void;
};

// ------- 결과지 계정 보관 유도 팝업 -------
// 테스트가 끝났을 때 띄워, 결과지를 계정에 연결해두라고 권한다.
// 로그인 자체는 아직 없어 두 버튼 모두 UI만 갖추고 동작은 호출부에서 채운다.
export default function SaveResultModal({ onLogin, onSkip }: SaveResultModalProps) {
  return (
    <div className="flex w-full flex-col items-center">
      <Typography variant="me2" className="text-gray-06 text-center break-keep">
        로그인하면 기록을 보관하고 친구와의
        <br />
        케미도 쉽게 확인할 수 있어요.
      </Typography>

      {/* 피그마 기준 간격: 부제목-칩 17px, 칩-버튼 그룹 49px, 버튼 사이 7px */}
      <div className="bg-gray-01 mt-[17px] flex w-full items-center justify-center rounded-[10px] px-4 py-[5.5px]">
        <Typography variant="me3" className="text-gray-06 text-center">
          지금 건너뛰면 결과지는 현재 기기에만 연결돼요.
        </Typography>
      </div>

      <div className="mt-[49px] flex w-full flex-col gap-[7px]">
        <button
          type="button"
          onClick={onLogin}
          className="bg-sub-4 flex h-[54px] w-full items-center justify-center rounded-[10px] text-white transition-opacity hover:opacity-90 active:opacity-80"
        >
          <Typography variant="h2" as="span">
            로그인하고 보관하기
          </Typography>
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="bg-gray-01 text-gray-05 flex h-[54px] w-full items-center justify-center rounded-[10px] transition-opacity hover:opacity-90 active:opacity-80"
        >
          <Typography variant="h2" as="span">
            나중에 할게요
          </Typography>
        </button>
      </div>
    </div>
  );
}
