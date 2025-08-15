// sort programmes most recently updated first
export default function mostRecentlyUpdatedFirst(a, b) {
  a.ts = a.ts || 0
  b.ts = b.ts || 0
  if (a.ts < b.ts) {
    return 1;
  } else if (a.ts > b.ts) {
    return -1;
  }
  return 0;
}
