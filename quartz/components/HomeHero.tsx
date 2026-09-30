import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
// @ts-ignore
import script from "./scripts/homeHero.inline"

const SECTIONS = [
  { key: "recipes", label: "Recipes", desc: "Food I cook regularly, mostly for my own reference", one: "recipe", many: "recipes" },
  { key: "guides", label: "Guides", desc: "Long-form how-tos and reference material", one: "guide", many: "guides" },
  { key: "quick-refs", label: "Quick Refs", desc: "Short cheat sheets I look up often", one: "cheat sheet", many: "cheat sheets" },
]

// tags used to classify notes, not to browse by
const HIDDEN_TAGS = ["recipe", "guide", "quick-ref"]

const HomeHero: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const from = fileData.slug!
  const count = (key: string) =>
    allFiles.filter((f) => f.slug?.startsWith(key + "/") && f.slug !== key + "/index").length

  const tagCounts = new Map<string, number>()
  allFiles.forEach((f) =>
    (f.frontmatter?.tags ?? []).forEach((t: string) => tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)),
  )
  const tags = [...tagCounts.entries()]
    .filter(([t]) => !HIDDEN_TAGS.includes(t))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 14)

  return (
    <div class="home-hero">
      <div class="home-hero-field">
        <h1>What are you looking for?</h1>
        <button type="button" class="home-search" aria-label="Search the site">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span class="home-search-hint">Try “chili”, “kefir”, “steak temp”…</span>
          <kbd>/</kbd>
        </button>
      </div>
      <div class="home-sections">
        {SECTIONS.map((s) => {
          const n = count(s.key)
          return (
            <a class="home-section" href={resolveRelative(from, (s.key + "/index") as FullSlug)}>
              <span class="home-section-count">
                {n} {n === 1 ? s.one : s.many}
              </span>
              <span class="home-section-title">{s.label}</span>
              <span class="home-section-desc">{s.desc}</span>
              <span class="home-section-arrow">→</span>
            </a>
          )
        })}
      </div>
      <div class="home-tags">
        <h3>Browse by tag</h3>
        <div class="home-tag-list">
          {tags.map(([t]) => (
            <a class="home-tag" href={resolveRelative(from, ("tags/" + t) as FullSlug)}>
              {t}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

HomeHero.afterDOMLoaded = script

export default (() => HomeHero) satisfies QuartzComponentConstructor
