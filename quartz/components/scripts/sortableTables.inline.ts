// Click-to-sort for tables on notes with `sortable: true` in their frontmatter.
// Columns whose cells all start with a number (for example "$1.20 / lb" or "~350") sort as
// numbers; everything else sorts as text. Columns with an empty header are not sortable.
// On phones the headers are hidden (tables become cards), so a sort dropdown is added too.

const parseNum = (text: string): number | null => {
  const m = text.replace(/,/g, "").match(/^[~≈]?\s*\$?\s*(-?\d+(?:\.\d+)?)/)
  return m ? parseFloat(m[1]) : null
}

document.addEventListener("nav", () => {
  if (!document.querySelector(".sortable-marker")) return

  document.querySelectorAll<HTMLTableElement>("article table").forEach((table) => {
    if (table.dataset.sortable === "true") return
    const headCells = Array.from(table.querySelectorAll<HTMLTableCellElement>("thead th"))
    if (headCells.length < 3) return
    const tbody = table.querySelector("tbody")
    if (!tbody) return
    const rows = Array.from(tbody.querySelectorAll<HTMLTableRowElement>("tr"))
    if (rows.length < 2) return

    table.dataset.sortable = "true"

    const labels = headCells.map((th) => (th.textContent ?? "").trim())
    const cellText = (tr: HTMLTableRowElement, i: number) =>
      (tr.children[i]?.textContent ?? "").trim()

    const numeric = labels.map((_, i) => {
      const values = rows.map((tr) => parseNum(cellText(tr, i)))
      return values.every((v) => v !== null)
    })

    let sortCol = -1
    let dir = 1

    const select = document.createElement("select")
    select.className = "sort-select"
    select.setAttribute("aria-label", "Sort table by")
    const toggle = document.createElement("button")
    toggle.type = "button"
    toggle.className = "sort-dir"
    toggle.setAttribute("aria-label", "Reverse sort order")

    const apply = () => {
      if (sortCol < 0) return
      const sorted = rows.slice().sort((a, b) => {
        const x = cellText(a, sortCol)
        const y = cellText(b, sortCol)
        let r: number
        if (numeric[sortCol]) {
          r = (parseNum(x) as number) - (parseNum(y) as number)
        } else {
          r = x.localeCompare(y, undefined, { numeric: true, sensitivity: "base" })
        }
        return r * dir
      })
      sorted.forEach((tr) => tbody.appendChild(tr))

      headCells.forEach((th, i) => {
        if (!th.classList.contains("sortable-th")) return
        const on = i === sortCol
        th.classList.toggle("sorted", on)
        th.setAttribute("aria-sort", on ? (dir === 1 ? "ascending" : "descending") : "none")
        const arrow = th.querySelector<HTMLElement>(".sort-arrow")
        if (arrow) arrow.textContent = on ? (dir === 1 ? "↑" : "↓") : "↕"
      })
      select.value = String(sortCol)
      toggle.textContent = dir === 1 ? "↑" : "↓"
    }

    const choose = (i: number) => {
      if (sortCol === i) {
        dir = -dir
      } else {
        sortCol = i
        dir = 1
      }
      apply()
    }

    headCells.forEach((th, i) => {
      if (!labels[i]) return
      th.classList.add("sortable-th")
      th.tabIndex = 0
      th.setAttribute("role", "columnheader")
      th.setAttribute("aria-sort", "none")
      const arrow = document.createElement("span")
      arrow.className = "sort-arrow"
      arrow.setAttribute("aria-hidden", "true")
      arrow.textContent = "↕"
      th.appendChild(arrow)
      th.addEventListener("click", () => choose(i))
      th.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          choose(i)
        }
      })

      const opt = document.createElement("option")
      opt.value = String(i)
      opt.textContent = labels[i]
      select.appendChild(opt)
    })

    select.addEventListener("change", () => {
      sortCol = parseInt(select.value, 10)
      dir = 1
      apply()
    })
    toggle.addEventListener("click", () => {
      if (sortCol < 0) {
        sortCol = parseInt(select.value, 10) || 0
      }
      dir = -dir
      apply()
    })

    const controls = document.createElement("div")
    controls.className = "sort-controls"
    const label = document.createElement("label")
    label.textContent = "Sort by"
    label.appendChild(select)
    controls.appendChild(label)
    controls.appendChild(toggle)
    toggle.textContent = "↕"

    const container = table.closest(".table-container") ?? table
    container.parentElement?.insertBefore(controls, container)
  })
})
