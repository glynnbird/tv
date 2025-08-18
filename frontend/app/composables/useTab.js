export default function () {
  // which tab we're looking at
  const tab = useState('tab', () => { return '1' })


  // return the current tab
  return { tab }
}
