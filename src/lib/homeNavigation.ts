export const HOME_NAVIGATION_EVENT = "pakit:home-navigation";

export function notifyHomeNavigation() {
  window.dispatchEvent(new Event(HOME_NAVIGATION_EVENT));
}
