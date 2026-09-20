// @ts-ignore
import script from "./scripts/shareShoppingList.inline"
import style from "./styles/shareShoppingList.scss"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const ShareShoppingList: QuartzComponent = () => {
  return (
    <div class="share-shopping-container">
      <button class="share-shopping-btn" type="button" aria-label="Share shopping list">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        Share shopping list
      </button>
    </div>
  )
}

ShareShoppingList.css = style
ShareShoppingList.afterDOMLoaded = script

export default (() => ShareShoppingList) satisfies QuartzComponentConstructor
