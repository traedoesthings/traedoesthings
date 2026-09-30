// @ts-ignore
import script from "./scripts/printPage.inline"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const PrintPage: QuartzComponent = () => {
  return (
    <button class="print-page-btn" type="button" aria-label="Print page">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M6 9V2h12v7"></path>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
      </svg>
      Print
    </button>
  )
}

PrintPage.afterDOMLoaded = script

export default (() => PrintPage) satisfies QuartzComponentConstructor
