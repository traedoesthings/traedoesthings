// The hero "search field" is a button that opens Quartz's own search modal.
document.addEventListener("nav", () => {
  const btn = document.querySelector<HTMLButtonElement>(".home-search")
  if (!btn) return
  const open = () => document.querySelector<HTMLButtonElement>(".search .search-button")?.click()
  btn.addEventListener("click", open)
  window.addCleanup(() => btn.removeEventListener("click", open))
})
