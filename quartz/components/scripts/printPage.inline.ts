document.addEventListener("nav", () => {
  const buttons = document.querySelectorAll<HTMLButtonElement>(".print-page-btn")
  const print = () => window.print()
  buttons.forEach((btn) => {
    btn.addEventListener("click", print)
    window.addCleanup(() => btn.removeEventListener("click", print))
  })
})
