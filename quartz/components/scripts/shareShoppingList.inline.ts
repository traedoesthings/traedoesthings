document.addEventListener("nav", () => {
  const buttons = document.querySelectorAll<HTMLButtonElement>(".share-shopping-btn")
  if (buttons.length === 0) return

  const buildList = (): { heading: string; text: string } | null => {
    // Find the Ingredients heading (h2)
    const h2s = Array.from(document.querySelectorAll("h2"))
    const ingHead = h2s.find((h) => {
      const t = (h.textContent ?? "").trim().toLowerCase()
      return t === "ingredients" || t.startsWith("ingredients")
    })
    if (!ingHead) {
      console.warn("[share] Could not find Ingredients heading")
      return null
    }

    const items: string[] = []
    let el: Element | null = ingHead.nextElementSibling
    while (el && el.tagName !== "H2") {
      if (el.tagName === "H3") {
        if (items.length > 0) items.push("")
        items.push(((el.textContent ?? "").trim()) + ":")
      } else if (el.tagName === "TABLE") {
        el.querySelectorAll("tbody tr").forEach((tr) => {
          const cells = tr.querySelectorAll("td")
          if (cells.length >= 2) {
            const ingredient = (cells[0].textContent ?? "").trim()
            const amount = (cells[1].textContent ?? "").trim()
            if (ingredient) {
              const line = amount ? `${amount} ${ingredient}` : ingredient
              items.push(`- ${line.replace(/\s+/g, " ").trim()}`)
            }
          } else if (cells.length === 1) {
            const single = (cells[0].textContent ?? "").trim()
            if (single) items.push(`- ${single}`)
          }
        })
      } else if (el.tagName === "UL" || el.tagName === "OL") {
        el.querySelectorAll(":scope > li").forEach((li) => {
          const t = (li.textContent ?? "").trim()
          if (t) items.push(`- ${t}`)
        })
      } else if (el.querySelector) {
        // Fallback: dig into nested wrappers for a table
        const nestedTable = el.querySelector("table")
        if (nestedTable) {
          nestedTable.querySelectorAll("tbody tr").forEach((tr) => {
            const cells = tr.querySelectorAll("td")
            if (cells.length >= 2) {
              const ingredient = (cells[0].textContent ?? "").trim()
              const amount = (cells[1].textContent ?? "").trim()
              if (ingredient) {
                items.push(`- ${amount} ${ingredient}`.replace(/\s+/g, " ").trim())
              }
            }
          })
        }
      }
      el = el.nextElementSibling
    }

    if (items.length === 0) {
      console.warn("[share] Ingredients section found but no items extracted")
      return null
    }

    const title = (document.querySelector("h1")?.textContent ?? "Recipe").trim()
    const heading = `Shopping List: ${title}`
    return { heading, text: `${heading}\n\n${items.join("\n").trim()}` }
  }

  const copyToClipboard = async (text: string, btn: HTMLButtonElement) => {
    const originalHTML = btn.innerHTML
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Legacy fallback
        const ta = document.createElement("textarea")
        ta.value = text
        ta.style.position = "fixed"
        ta.style.left = "-9999px"
        document.body.appendChild(ta)
        ta.select()
        document.execCommand("copy")
        document.body.removeChild(ta)
      }
      btn.classList.add("copied")
      btn.textContent = "Copied to clipboard"
      setTimeout(() => {
        btn.classList.remove("copied")
        btn.innerHTML = originalHTML
      }, 2000)
    } catch (e) {
      console.error("[share] Clipboard copy failed", e)
      btn.textContent = "Copy failed"
      setTimeout(() => {
        btn.innerHTML = originalHTML
      }, 2000)
    }
  }

  buttons.forEach((btn) => {
    const handleClick = async (e: Event) => {
      e.preventDefault()
      const built = buildList()
      if (!built) {
        btn.textContent = "Ingredients not found"
        setTimeout(() => location.reload(), 1500)
        return
      }
      const { heading, text } = built

      if (typeof navigator.share === "function") {
        try {
          await navigator.share({ title: heading, text })
          return
        } catch (err: any) {
          if (err && err.name === "AbortError") return
          console.warn("[share] navigator.share failed, falling back to clipboard", err)
        }
      }
      await copyToClipboard(text, btn)
    }

    btn.addEventListener("click", handleClick)
    window.addCleanup(() => btn.removeEventListener("click", handleClick))
  })
})
