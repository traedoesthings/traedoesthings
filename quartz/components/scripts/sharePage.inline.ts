document.addEventListener("nav", () => {
  const buttons = document.querySelectorAll<HTMLButtonElement>(".share-page-btn")
  if (buttons.length === 0) return

  const copyText = async (text: string, btn: HTMLButtonElement) => {
    const originalHTML = btn.innerHTML
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
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
      btn.textContent = "Link copied"
      setTimeout(() => {
        btn.classList.remove("copied")
        btn.innerHTML = originalHTML
      }, 2000)
    } catch (e) {
      console.error("[share-page] clipboard copy failed", e)
      btn.textContent = "Copy failed"
      setTimeout(() => {
        btn.innerHTML = originalHTML
      }, 2000)
    }
  }

  buttons.forEach((btn) => {
    const handleClick = async (e: Event) => {
      e.preventDefault()
      const title = (document.querySelector("h1")?.textContent ?? document.title).trim()
      const url = window.location.href

      if (typeof navigator.share === "function") {
        try {
          await navigator.share({ title, url })
          return
        } catch (err: any) {
          if (err && err.name === "AbortError") return
          console.warn("[share-page] navigator.share failed, falling back to clipboard", err)
        }
      }
      await copyText(url, btn)
    }

    btn.addEventListener("click", handleClick)
    window.addCleanup(() => btn.removeEventListener("click", handleClick))
  })
})
