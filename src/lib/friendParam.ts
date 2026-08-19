/**
 * friend 쿼리파라미터를 물고 들어온 경우, 이동할 경로에도 그대로 이어 붙인다.
 */
export function appendFriendParam(to: string, friend: string | null): string {
  if (!friend) return to;

  const [path, query] = to.split("?");
  const params = new URLSearchParams(query);
  params.set("friend", friend);
  return `${path}?${params.toString()}`;
}
