import FriendChemiTestModal from "@/components/result/FriendChemiTestModal";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import { buildChemiTestMessage, canUseSystemShare, share } from "@/utils/share";

/** 홈과 보관함에서 같은 케미 초대 팝업을 연다. */
export function useChemiShareModal(mine?: { code: string; name: string }) {
  const toast = useToast();
  const { open, close } = useModal();
  return () => {
    if (!mine) return;
    const url = new URL("/", window.location.origin);
    url.searchParams.set("friend", mine.code);
    const message = buildChemiTestMessage({ resultName: mine.name, url: url.toString() });
    open({
      title: "친구 케미 테스트",
      contents: (
        <FriendChemiTestModal
          message={message}
          onShare={async () => {
            try {
              await navigator.clipboard.writeText(message);
              toast.open("문구를 복사했어요");
            } catch {
              if (!canUseSystemShare()) {
                toast.open("문구를 복사하지 못했어요. 다시 시도해주세요.");
                return;
              }
            }
            if (canUseSystemShare()) {
              await share({
                title: `나 '${mine.name}' 나왔어.`,
                text: "우리 케미는 몇 점일까? 여기서 확인해줘!",
                url: url.toString(),
              });
            }
            close();
          }}
          onCopyLink={async () => {
            try {
              await navigator.clipboard.writeText(url.toString());
              toast.open("링크를 복사했어요");
              close();
            } catch {
              toast.open("링크를 복사하지 못했어요. 다시 시도해주세요.");
            }
          }}
        />
      ),
    });
  };
}
