import tsundere from "@/assets/img/characters/character-tsundere.png";
import morningPerson from "@/assets/img/characters/character-morning-person.png";
import unplanned from "@/assets/img/characters/character-unplanned.png";
import photoObsessed from "@/assets/img/characters/character-photo-obsessed.png";
import reluctantWalker from "@/assets/img/characters/character-reluctant-walker.png";
import planner from "@/assets/img/characters/character-planner.png";
import memeAddict from "@/assets/img/characters/character-meme-addict.png";
import bigEater from "@/assets/img/characters/character-big-eater.png";

export type CharacterAsset = {
  image: string;
  alt: string;
};

/**
 * character_id 키는 백엔드 스펙이 아직 확정되지 않아 임의로 지정한 영문 snake_case 값입니다.
 * 실제 API 값이 확정되면 이 키들을 맞춰 수정해주세요.
 */
export const CHARACTER_ASSETS: Record<string, CharacterAsset> = {
  tsundere: { image: tsundere, alt: "츤데레 캐릭터" },
  morning_person: { image: morningPerson, alt: "아침형 인간 캐릭터" },
  unplanned: { image: unplanned, alt: "무계획형 캐릭터" },
  photo_obsessed: { image: photoObsessed, alt: "사진 집착러 캐릭터" },
  reluctant_walker: { image: reluctantWalker, alt: "걷기 싫어하는 친구 캐릭터" },
  planner: { image: planner, alt: "계획형 캐릭터" },
  meme_addict: { image: memeAddict, alt: "밈 중독자 캐릭터" },
  big_eater: { image: bigEater, alt: "먹짱 캐릭터" },
};

const DEFAULT_CHARACTER_ASSET: CharacterAsset = { image: tsundere, alt: "캐릭터" };

export function getCharacterAsset(characterId: string): CharacterAsset {
  return CHARACTER_ASSETS[characterId] ?? DEFAULT_CHARACTER_ASSET;
}
