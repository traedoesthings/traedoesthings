// @ts-ignore
import script from "./scripts/sharePage.inline"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const SharePage: QuartzComponent = () => {
  return (
    <button class="share-page-btn" type="button" aria-label="Share page">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
      </svg>
      Copy link
    </button>
  )
}

SharePage.afterDOMLoaded = script

export default (() => SharePage) satisfies QuartzComponentConstructor
