// convert data from the form required to store it as JSON, into a dynamic object again
// - convert date string to Date object
// - convert stars array into comma-separated string
export default function deserialize(p) {
  // convert plain object to form required by front end
  p.date = new Date(p.date)
  if (Array.isArray(p.stars)) {
    p.stars = p.stars.join(',')
  }
  return p
}
