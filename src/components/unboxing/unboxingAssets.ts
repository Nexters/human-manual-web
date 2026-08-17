import defaultClosedGif from "@/assets/gif/unboxing.gif";
import defaultOpenImg from "@/assets/img/unboxing/box-open.png";
import type { PackagingType } from "@/types/assessment";

// TODO: 박스 종류별 전용 닫힘/열림 에셋이 추가되면 이 매핑을 채운다.
const CLOSED_BOX_MAP: Partial<Record<PackagingType, string>> = {};
const OPEN_BOX_MAP: Partial<Record<PackagingType, string>> = {};

export function getClosedBoxAsset(packagingType?: PackagingType): string {
  return (packagingType && CLOSED_BOX_MAP[packagingType]) ?? defaultClosedGif;
}

export function getOpenBoxAsset(packagingType?: PackagingType): string {
  return (packagingType && OPEN_BOX_MAP[packagingType]) ?? defaultOpenImg;
}
