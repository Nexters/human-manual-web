import friendsIcon from "@/assets/images/result/charge/friends.png";
import beerIcon from "@/assets/images/result/charge/berr.png";
import airplaneIcon from "@/assets/images/result/charge/airplane.png";

/** charging.activities[].type → 아이콘 매핑. 알 수 없는 type은 friendsIcon으로 폴백. */
export const CHARGING_ACTIVITY_ICON_MAP: Record<string, string> = {
  hangout: friendsIcon,
  beer: beerIcon,
  travel: airplaneIcon,
};

export const DEFAULT_CHARGING_ACTIVITY_ICON = friendsIcon;

export function getChargingActivityIcon(type: string): string {
  return CHARGING_ACTIVITY_ICON_MAP[type] ?? DEFAULT_CHARGING_ACTIVITY_ICON;
}
