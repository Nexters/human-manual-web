import Typography from "@/components/shared/Typography";

const AI_PROMPT = `챗지피티야 나 얘랑 지금
싸웠는데 솔직히 내가
잘못한 것 같아서 친구한테
사과하려고 해. 진심이
담기게 사과문 좀 써줘.
아니 말을 좀 더 부드럽게
해봐 AI가 쓴것 같지 않게
사람이 쓴것처럼. 아니 그게
아니라니까 좀 자연스럽게
못하냐 진심이 담겨야한다고`;

type PairCardMockupProps = {
  value: string;
};

const PairCardMockup = ({ value }: PairCardMockupProps) => {
  if (value === "rehearse_with_ai") {
    return (
      <div className="absolute inset-0 overflow-hidden rounded-[10px]" aria-hidden>
        <p className="text-gray-04 absolute -top-[5px] left-0 text-[22.121px] leading-[1.5] font-medium tracking-[-0.8848px] whitespace-pre">
          {AI_PROMPT}
        </p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[10px]" aria-hidden>
      <div className="absolute top-[29px] left-[16.59px] flex h-[34.109px] w-[136.412px] items-center justify-center rounded-[15px] rounded-bl-none bg-white">
        <Typography variant="sb4" as="span" className="text-black">
          됐다 그만하자.
        </Typography>
      </div>

      <div className="absolute top-[146px] left-0 h-[50px] w-[169.588px] rounded-[10px] bg-white">
        <Typography variant="sb4" as="span" className="absolute top-[13px] left-[12px] text-black">
          야 나 할말 있어
        </Typography>
      </div>
      <div className="absolute top-[153px] left-[116px] flex h-[37px] w-[46px] items-center justify-center rounded-[6px] bg-chip-yellow">
        <Typography variant="me2" as="span" className="text-black">
          전송
        </Typography>
      </div>
    </div>
  );
};

export default PairCardMockup;
