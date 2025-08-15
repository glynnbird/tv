// sort programmes newest first
export default function newestFirst(a, b) {
  if (a.date.getTime() < b.date.getTime()) {
    return 1;
  } else if (a.date > b.date) {
    return -1;
  }
  return 0;
}
