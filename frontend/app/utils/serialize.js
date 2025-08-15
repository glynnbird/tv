
// convert data from the form required by the front end into the form required to store as JSON
// - convert Date object to string
// - convert stars comma-separated string to array
export default function serialize(p) {
  // convert plain object to form required by front end
  p.date = new Date(p.date)
  if (typeof p.stars === 'string' && p.stars.length > 0) {
    p.stars = p.stars.split(',').map((s) => { return s.trim()})
  }
  p.ts = Math.floor(new Date().getTime() / 1000)
  return p
}
