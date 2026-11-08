// @ts-ignore
import script from "./scripts/sortableTables.inline"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

// Opt-in: add `sortable: true` to a note's frontmatter and its tables with 3+ columns get
// click-to-sort headers (plus a sort dropdown on phones, where headers are hidden).
// This component only renders a hidden marker; the script does the work.
const SortableTables: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const flag = fileData.frontmatter?.sortable
  if (flag === true || flag === "true") {
    return <div class="sortable-marker" hidden aria-hidden="true"></div>
  }
  return null
}

SortableTables.afterDOMLoaded = script

export default (() => SortableTables) satisfies QuartzComponentConstructor
