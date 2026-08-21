import defaultClosedGif from "@/assets/gif/unboxing.gif";
import fragileBoxGloveGif from "@/assets/gif/unboxing/fragile_box_glove.gif";
import fragileBoxMagicWandGif from "@/assets/gif/unboxing/fragile_box_magic_wand.gif";
import fragileBoxChainsawGif from "@/assets/gif/unboxing/fragile_box_chainsaw.gif";
import fragileBoxUtilityKnifeGif from "@/assets/gif/unboxing/fragile_box_utility_knife.gif";
import minimalBoxGloveGif from "@/assets/gif/unboxing/minimal_box_glove.gif";
import minimalBoxMagicWandGif from "@/assets/gif/unboxing/minimal_box_magic_wand.gif";
import minimalBoxChainsawGif from "@/assets/gif/unboxing/minimal_box_chainsaw.gif";
import minimalBoxUtilityKnifeGif from "@/assets/gif/unboxing/minimal_box_utility_knife.gif";
import lockedBoxGloveGif from "@/assets/gif/unboxing/locked_box_glove.gif";
import lockedBoxMagicWandGif from "@/assets/gif/unboxing/locked_box_magic_wand.gif";
import lockedBoxChainsawGif from "@/assets/gif/unboxing/locked_box_chainsaw.gif";
import lockedBoxUtilityKnifeGif from "@/assets/gif/unboxing/locked_box_utility_knife.gif";
import matryoshkaBoxGloveGif from "@/assets/gif/unboxing/matryoshka_box_glove.gif";
import matryoshkaBoxMagicWandGif from "@/assets/gif/unboxing/matryoshka_box_magic_wand.gif";
import matryoshkaBoxChainsawGif from "@/assets/gif/unboxing/matryoshka_box_chainsaw.gif";
import matryoshkaBoxUtilityKnifeGif from "@/assets/gif/unboxing/matryoshka_box_utility_knife.gif";
import fragileBoxGloveImg from "@/assets/img/unboxing/fragile_box_glove.png";
import fragileBoxMagicWandImg from "@/assets/img/unboxing/fragile_box_magic_wand.png";
import fragileBoxChainsawImg from "@/assets/img/unboxing/fragile_box_chainsaw.png";
import fragileBoxUtilityKnifeImg from "@/assets/img/unboxing/fragile_box_utility_knife.png";
import minimalBoxGloveImg from "@/assets/img/unboxing/minimal_box_glove.png";
import minimalBoxMagicWandImg from "@/assets/img/unboxing/minimal_box_magic_wand.png";
import minimalBoxChainsawImg from "@/assets/img/unboxing/minimal_box_chainsaw.png";
import minimalBoxUtilityKnifeImg from "@/assets/img/unboxing/minimal_box_utility_knife.png";
import lockedBoxGloveImg from "@/assets/img/unboxing/locked_box_glove.png";
import lockedBoxMagicWandImg from "@/assets/img/unboxing/locked_box_magic_wand.png";
import lockedBoxChainsawImg from "@/assets/img/unboxing/locked_box_chainsaw.png";
import lockedBoxUtilityKnifeImg from "@/assets/img/unboxing/locked_box_utility_knife.png";
import matryoshkaBoxGloveImg from "@/assets/img/unboxing/matryoshka_box_glove.png";
import matryoshkaBoxMagicWandImg from "@/assets/img/unboxing/matryoshka_box_magic_wand.png";
import matryoshkaBoxChainsawImg from "@/assets/img/unboxing/matryoshka_box_chainsaw.png";
import matryoshkaBoxUtilityKnifeImg from "@/assets/img/unboxing/matryoshka_box_utility_knife.png";
import type { OpeningToolType, PackagingType } from "@/types/assessment";

type ComboKey = `${PackagingType}__${OpeningToolType}`;

const toComboKey = (packagingType: PackagingType, openingToolType: OpeningToolType): ComboKey =>
  `${packagingType}__${openingToolType}`;

const CLOSED_BOX_MAP: Record<ComboKey, string> = {
  fragile_box__glove: fragileBoxGloveGif,
  fragile_box__magic_wand: fragileBoxMagicWandGif,
  fragile_box__chainsaw: fragileBoxChainsawGif,
  fragile_box__utility_knife: fragileBoxUtilityKnifeGif,
  minimal_box__glove: minimalBoxGloveGif,
  minimal_box__magic_wand: minimalBoxMagicWandGif,
  minimal_box__chainsaw: minimalBoxChainsawGif,
  minimal_box__utility_knife: minimalBoxUtilityKnifeGif,
  locked_box__glove: lockedBoxGloveGif,
  locked_box__magic_wand: lockedBoxMagicWandGif,
  locked_box__chainsaw: lockedBoxChainsawGif,
  locked_box__utility_knife: lockedBoxUtilityKnifeGif,
  matryoshka_box__glove: matryoshkaBoxGloveGif,
  matryoshka_box__magic_wand: matryoshkaBoxMagicWandGif,
  matryoshka_box__chainsaw: matryoshkaBoxChainsawGif,
  matryoshka_box__utility_knife: matryoshkaBoxUtilityKnifeGif,
};

const DEFAULT_CLOSED_DURATION_MS = 4000;

// 조합별 gif의 실제 재생 길이(ms). 빌드 시점에 고정된 정적 에셋이므로,
// 런타임에 매번 fetch해 파싱하는 대신 미리 계산해 하드코딩한다.
// 에셋이 교체되면 `node scripts/print-gif-durations.mjs`로 값을 다시 뽑아 갱신해야 한다.
const CLOSED_BOX_DURATION_MAP: Record<ComboKey, number> = {
  fragile_box__glove: 2400,
  fragile_box__magic_wand: 2360,
  fragile_box__chainsaw: 2400,
  fragile_box__utility_knife: 2400,
  minimal_box__glove: 2400,
  minimal_box__magic_wand: 2400,
  minimal_box__chainsaw: 2400,
  minimal_box__utility_knife: 2400,
  locked_box__glove: 2400,
  locked_box__magic_wand: 2400,
  locked_box__chainsaw: 2400,
  locked_box__utility_knife: 2400,
  matryoshka_box__glove: 2360,
  matryoshka_box__magic_wand: 2440,
  matryoshka_box__chainsaw: 2200,
  matryoshka_box__utility_knife: 2320,
};

const OPEN_BOX_MAP: Record<ComboKey, string> = {
  fragile_box__glove: fragileBoxGloveImg,
  fragile_box__magic_wand: fragileBoxMagicWandImg,
  fragile_box__chainsaw: fragileBoxChainsawImg,
  fragile_box__utility_knife: fragileBoxUtilityKnifeImg,
  minimal_box__glove: minimalBoxGloveImg,
  minimal_box__magic_wand: minimalBoxMagicWandImg,
  minimal_box__chainsaw: minimalBoxChainsawImg,
  minimal_box__utility_knife: minimalBoxUtilityKnifeImg,
  locked_box__glove: lockedBoxGloveImg,
  locked_box__magic_wand: lockedBoxMagicWandImg,
  locked_box__chainsaw: lockedBoxChainsawImg,
  locked_box__utility_knife: lockedBoxUtilityKnifeImg,
  matryoshka_box__glove: matryoshkaBoxGloveImg,
  matryoshka_box__magic_wand: matryoshkaBoxMagicWandImg,
  matryoshka_box__chainsaw: matryoshkaBoxChainsawImg,
  matryoshka_box__utility_knife: matryoshkaBoxUtilityKnifeImg,
};

export function getClosedBoxAsset(
  packagingType?: PackagingType,
  openingToolType?: OpeningToolType,
): string {
  if (!packagingType || !openingToolType) return defaultClosedGif;
  return CLOSED_BOX_MAP[toComboKey(packagingType, openingToolType)] ?? defaultClosedGif;
}

export function getOpenBoxAsset(
  packagingType?: PackagingType,
  openingToolType?: OpeningToolType,
): string | undefined {
  if (!packagingType || !openingToolType) return undefined;
  return OPEN_BOX_MAP[toComboKey(packagingType, openingToolType)];
}

export function getClosedBoxDurationMs(
  packagingType?: PackagingType,
  openingToolType?: OpeningToolType,
): number {
  if (!packagingType || !openingToolType) return DEFAULT_CLOSED_DURATION_MS;
  return (
    CLOSED_BOX_DURATION_MAP[toComboKey(packagingType, openingToolType)] ??
    DEFAULT_CLOSED_DURATION_MS
  );
}
