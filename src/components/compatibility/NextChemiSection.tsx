import Typography from "@/components/shared/Typography";
import friendBear from "@/assets/img/result/share/bear.png";
import questionMark from "@/assets/img/result/share/question.png";

type NextChemiSectionProps = {
  /** 이 브라우저에 저장된 코드로 식별한 "나". 프로필 대결 왼쪽 라벨. */
  myNickname: string;
  /** 그 사람의 장난감 이미지. hasMyCode 가 false 면 undefined 로 넘어온다. */
  myImageUrl?: string;
  /**
   * 이 브라우저에서 테스트를 마친 사람인지. 저장된 결과 코드로 판단한다.
   * true 면 링크 공유로 다음 케미, false 면 테스트부터 시작한다.
   */
  hasMyCode: boolean;
  /** (hasMyCode) "새 친구와 케미 보기" — 내 케미 링크 복사. */
  onShareMyChemiLink: () => void;
  /** (!hasMyCode) "테스트하고 케미 보기" — 온보딩으로 테스트 시작. */
  onStartTest: () => void;
  /** (!hasMyCode) "이미 테스트 했다면?" — 코드 입력 모달. */
  onEnterCode: () => void;
  /** "케미 페이지 공유하기" — 이 케미 페이지를 공유한다. */
  onShareChemiPage: () => void;
};

// ------- 케미 페이지 하단, 다음 케미로 가는 섹션 ------
// 케미 페이지 URL 에는 코드 두 개가 실려 있어서, 이 화면은 루프의 분기점이다. 그런데
// 열람자가 누구인지는 URL 로 알 수 없다 — 이 브라우저에 저장된 결과 코드 하나로만 판단한다.
//
// hasMyCode 면(내가 테스트를 마쳤으면) 링크만 공유하면 되니 새 디자인을 그대로 쓴다.
// 아니면(제3자) 테스트부터 해야 하므로, 결과지 하단·초대 화면과 같은 핑크 버튼 두 개로
// "테스트하고 케미 보기 / 이미 테스트 했다면?" 을 준다.
export default function NextChemiSection({
  myNickname,
  myImageUrl,
  hasMyCode,
  onShareMyChemiLink,
  onStartTest,
  onEnterCode,
  onShareChemiPage,
}: NextChemiSectionProps) {
  return (
    <div className="flex flex-col items-center px-5 pb-8">
      <div className="flex flex-col items-center gap-[2px]">
        <Typography variant="h2" className="text-gray-09 text-center break-keep">
          {hasMyCode ? "다른 친구랑 케미 보기" : "나도 테스트하고 케미 보기"}
        </Typography>
        <Typography variant="sb3" className="text-gray-06 text-center break-keep">
          {hasMyCode
            ? "링크를 공유해 다른 친구와 케미를 확인해요"
            : "테스트를 마치면 친구와의 케미를 볼 수 있어요"}
        </Typography>
      </div>

      <div className="mt-14 flex items-start justify-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex size-[93px] items-center justify-center rounded-full bg-white">
            {hasMyCode && myImageUrl ? (
              <img src={myImageUrl} alt="" className="size-[72px] object-contain" />
            ) : (
              // 내가 누군지 모르면(hasMyCode=false) 친구 칸과 같은 회색 실루엣으로 둔다.
              <>
                <img src={friendBear} alt="" className="size-[78px] object-contain" />
                <img src={questionMark} alt="" className="absolute h-[18px] w-auto" />
              </>
            )}
          </div>
          <Typography variant="sb4" className={hasMyCode ? "text-gray-07" : "text-gray-04"}>
            {hasMyCode ? `${myNickname}님` : "나"}
          </Typography>
        </div>

        <div className="flex h-[93px] items-center">
          <Typography variant="me3" as="span" className="text-gray-04">
            ×
          </Typography>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="relative flex size-[93px] items-center justify-center rounded-full bg-white">
            <img src={friendBear} alt="" className="size-[78px] object-contain" />
            <img src={questionMark} alt="" className="absolute h-[18px] w-auto" />
          </div>
          <Typography variant="sb4" className="text-gray-04">
            친구
          </Typography>
        </div>
      </div>

      <div className="mt-14 flex w-full flex-col gap-3">
        {hasMyCode ? (
          <>
            <button
              type="button"
              onClick={onShareMyChemiLink}
              className="bg-main flex h-[54px] w-full items-center justify-center rounded-[10px] text-white transition-opacity hover:opacity-90 active:opacity-80"
            >
              <Typography variant="h2" as="span">
                새 친구와 케미 보기
              </Typography>
            </button>
            <button
              type="button"
              onClick={onShareChemiPage}
              className="border-main text-main flex h-[54px] w-full items-center justify-center rounded-[10px] border-[1.5px] bg-white transition-opacity hover:opacity-90 active:opacity-80"
            >
              <Typography variant="h2" as="span">
                케미 페이지 공유하기
              </Typography>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onStartTest}
              className="bg-sub-4 flex h-[54px] w-full items-center justify-center rounded-[10px] text-white transition-opacity hover:opacity-90 active:opacity-80"
            >
              <Typography variant="h2" as="span">
                테스트하고 케미 보기
              </Typography>
            </button>
            <button
              type="button"
              onClick={onEnterCode}
              className="border-point text-sub-4 flex h-[54px] w-full items-center justify-center rounded-[10px] border bg-white transition-opacity hover:opacity-90 active:opacity-80"
            >
              <Typography variant="h2" as="span">
                이미 테스트 했다면?
              </Typography>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
