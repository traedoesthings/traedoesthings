document.addEventListener("nav", () => {
  const btn = document.querySelector<HTMLButtonElement>(".share-shopping-btn")
  if (!btn) return

  const handleClick = async () => {
    // Locate the Ingredients heading
    const headings = Array.from(document.querySelectorAll("h2, h3"))
    const ingHead = headings.find(
      (h) => h.textContent?.trim().toLowerCase() === "ingredients",
    )
    if (!ingHead) return

    const items: string[] = []
    let el = ingHead.nextElementSibling
    while (el && el.tagName !== "H2") {
      if (el.tagName === "H3") {
        items.push("")
        items.push(el.textContent?.trim() + ":")
      }
      if (el.tagName === "TABLE") {
        el.querySelectorAll("tbody tr").forEach((tr) => {
          const cells = tr.querySelectorAll("td")
          if (cells.length >= 2) {
            const ingredient = cells[0].textContent?.trim() ?? ""
            const amount = cells[1].textContent?.trim() ?? ""
            items.push(`- ${amount} ${ingredient}`.replace(/\s+/g, " ").trim())
          } else if (cells.length === 1) {
            const single = cells[0].textContent?.trim() ?? ""
            if (single) items.push(`- ${single}`)
          }
        })
      }
      // Also grab bulleted lists in case a note uses ul instead of tables
      if (el.tagName === "UL") {
        el.querySelectorAll("li").forEach((li) => {
          const t = li.textContent?.trim()
          if (t) items.push(`- ${t}`)
        })
      }
      el = el.nextElementSibling
    }

    if (items.length === 0) return

    const title = document.querySelector("h1")?.textContent?.trim() ?? "Recipe"
    const heading = `Shopping List: ${title}`
    const text = `${heading}\n\n${items.join("\n").trim()}`

    const copyFallback = async () => {
      try {
        await navigator.clipboard.writeText(text)
        const original = btn.innerHTML
        btn.classList.add("copied")
        btn.innerHTML = "Copied to clipboard"
        setTimeout(() => {
          btn.classList.remove("copied")
          btn.innerHTML = original
        }, 2000)
      } catch (e) {
        console.error("Clipboard copy failed", e)
      }
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: heading, text })
      } catch (err: any) {
        if (err && err.name !== "AbortError") {
          await copyFallback()
        }
      }
    } else {
      await copyFallback()
    }
  }

  btn.addEventListener("click", handleClick)
  window.addCleanup(() => btn.removeEventListener("click", handleClick))
})
