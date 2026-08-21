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
