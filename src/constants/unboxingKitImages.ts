import boxImg from "@/assets/img/result/unboxing/box.png";
import magicStickImg from "@/assets/img/result/unboxing/magic_stick.png";
import type { PackagingType, OpeningToolType } from "@/types/assessment";

/**
 * packaging.type → 이미지 매핑.
 * TODO: fragile_box / minimal_box / locked_box 전용 에셋이 아직 없어 matryoshka_box(box.png)로 폴백 중.
 */
export const PACKAGING_IMAGE_MAP: Record<PackagingType, string> = {
  matryoshka_box: boxImg,
  fragile_box: boxImg,
  minimal_box: boxImg,
  locked_box: boxImg,
};

/**
 * opening_tool.type → 이미지 매핑.
 * TODO: utility_knife / chainsaw 전용 에셋이 아직 없어 magic_wand(magic_stick.png)로 폴백 중.
 */
export const OPENING_TOOL_IMAGE_MAP: Record<OpeningToolType, string> = {
  magic_wand: magicStickImg,
  glove: magicStickImg,
  utility_knife: magicStickImg,
  chainsaw: magicStickImg,
};
