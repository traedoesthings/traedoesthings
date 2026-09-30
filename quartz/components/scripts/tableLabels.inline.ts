// Copies each column header onto its cells (data-label) and flags tables with 3+ columns
// (data-stack) so they can be shown as stacked cards on phones.
document.addEventListener("nav", () => {
  document.querySelectorAll<HTMLTableElement>("article table").forEach((table) => {
    const heads = Array.from(table.querySelectorAll("thead th")).map((th) =>
      (th.textContent ?? "").trim(),
    )
    if (heads.length < 3) return
    table.dataset.stack = "true"
    table.querySelectorAll("tbody tr").forEach((tr) => {
      tr.querySelectorAll("td").forEach((td, i) => {
        if (heads[i]) td.dataset.label = heads[i]
      })
    })
  })
})
