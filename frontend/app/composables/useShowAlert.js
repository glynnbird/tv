export default function () {
  // where the state of an alert is stored
  const alert = useAlert()

  function showAlert(message, colour='primary') {
    if (message) {
      alert.value.message = message
      alert.value.colour = colour
      alert.value.show = true
      setTimeout(() => {
        alert.value.show = false
      }, 2000)
    }
  }
  return { showAlert }
}
