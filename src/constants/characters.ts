import spinningTop from "@/assets/img/toys/toy-top.png";
import teddyBear from "@/assets/img/toys/toy-teddy-bear.png";
import secretBox from "@/assets/img/toys/toy-secret-box.png";
import bulldozer from "@/assets/img/toys/toy-bulldozer.png";
import cracker from "@/assets/img/toys/toy-cracker.png";
import telescope from "@/assets/img/toys/toy-telescope.png";
import kite from "@/assets/img/toys/toy-kite.png";
import train from "@/assets/img/toys/toy-train.png";
import xylophone from "@/assets/img/toys/toy-xylophone.png";
import tools from "@/assets/img/toys/toy-tools.png";
import cube from "@/assets/img/toys/toy-cube.png";
import rcCar from "@/assets/img/toys/toy-rc-car.png";
import bed from "@/assets/img/toys/toy-bed.png";
import helicopter from "@/assets/img/toys/toy-helicopter.png";
import tea from "@/assets/img/toys/toy-tea.png";
import robot from "@/assets/img/toys/toy-robot.png";

export type CharacterAsset = {
  image: string;
  alt: string;
};

/**
 * character_id는 api.pakit.kr OpenAPI 스펙(/api/compatibility 예시)에 spinning_top, teddy_bear,
 * cube 3개만 명시되어 있고 나머지는 자유 문자열이라 문서화된 전체 목록이 없습니다.
 * 아래 3개(spinning_top/teddy_bear/cube)는 스펙에서 확인된 값이고, 나머지는 Figma 레이어명을
 * 영문 snake_case로 임의 변환한 추측값이니 실제 값 확정 시 맞춰 수정해주세요.
 */
export const CHARACTER_ASSETS: Record<string, CharacterAsset> = {
  spinning_top: { image: spinningTop, alt: "팽이 캐릭터" },
  teddy_bear: { image: teddyBear, alt: "곰인형 캐릭터" },
  secret_box: { image: secretBox, alt: "비밀상자 캐릭터" },
  bulldozer: { image: bulldozer, alt: "불도저 캐릭터" },
  cracker: { image: cracker, alt: "쿠크다스 캐릭터" },
  telescope: { image: telescope, alt: "망원경 캐릭터" },
  kite: { image: kite, alt: "연 캐릭터" },
  train: { image: train, alt: "기차 캐릭터" },
  xylophone: { image: xylophone, alt: "실로폰 캐릭터" },
  tools: { image: tools, alt: "공구 캐릭터" },
  cube: { image: cube, alt: "큐브 캐릭터" },
  rc_car: { image: rcCar, alt: "RC카 캐릭터" },
  bed: { image: bed, alt: "침대 캐릭터" },
  helicopter: { image: helicopter, alt: "헬리콥터 캐릭터" },
  tea: { image: tea, alt: "티세트 캐릭터" },
  robot: { image: robot, alt: "로봇 캐릭터" },
};

const DEFAULT_CHARACTER_ASSET: CharacterAsset = { image: spinningTop, alt: "캐릭터" };

export function getCharacterAsset(characterId: string): CharacterAsset {
  return CHARACTER_ASSETS[characterId] ?? DEFAULT_CHARACTER_ASSET;
}
