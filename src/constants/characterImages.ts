import bedImg from "@/assets/images/result/toy/bed.png";
import bulldozerImg from "@/assets/images/result/toy/bulldozer.png";
import cookieImg from "@/assets/images/result/toy/cookie.png";
import cubeImg from "@/assets/images/result/toy/cube.png";
import helicopterImg from "@/assets/images/result/toy/helicopter.png";
import kiteImg from "@/assets/images/result/toy/kite.png";
import rcCarImg from "@/assets/images/result/toy/rc_car.png";
import robotImg from "@/assets/images/result/toy/robot.png";
import secretImg from "@/assets/images/result/toy/secret.png";
import teaImg from "@/assets/images/result/toy/tea.png";
import teddyBearImg from "@/assets/images/result/toy/teddy_bear.png";
import telescopeImg from "@/assets/images/result/toy/telescope.png";
import toolsImg from "@/assets/images/result/toy/tools.png";
import topImg from "@/assets/images/result/toy/top.png";
import trainImg from "@/assets/images/result/toy/train.png";
import xylophoneImg from "@/assets/images/result/toy/xylophone.png";

/** character_id → 로컬 캐릭터 이미지 매핑. API의 image_url은 사용하지 않는다. */
export const CHARACTER_IMAGE_MAP: Record<string, string> = {
  bed: bedImg,
  bulldozer: bulldozerImg,
  cookie: cookieImg,
  cube: cubeImg,
  helicopter: helicopterImg,
  kite: kiteImg,
  rc_car: rcCarImg,
  robot: robotImg,
  secret: secretImg,
  tea: teaImg,
  teddy_bear: teddyBearImg,
  telescope: telescopeImg,
  tools: toolsImg,
  spinning_top: topImg,
  top: topImg,
  train: trainImg,
  xylophone: xylophoneImg,
};

export const DEFAULT_CHARACTER_IMAGE = topImg;

export function getCharacterImage(characterId: string): string {
  return CHARACTER_IMAGE_MAP[characterId] ?? DEFAULT_CHARACTER_IMAGE;
}
