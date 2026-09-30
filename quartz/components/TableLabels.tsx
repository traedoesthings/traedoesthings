// @ts-ignore
import script from "./scripts/tableLabels.inline"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

// Renders nothing; its script tags wide tables so custom.scss can stack them on phones.
const TableLabels: QuartzComponent = () => null

TableLabels.afterDOMLoaded = script

export default (() => TableLabels) satisfies QuartzComponentConstructor
