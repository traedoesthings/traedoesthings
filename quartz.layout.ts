import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

const isIndex = (slug?: string) => slug === "index"
const isListing = (slug?: string) => isIndex(slug) || (slug ?? "").endsWith("/index")

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [Component.TableLabels()], // also tags wide tables for the phone card layout
  footer: Component.Footer({
    links: {},
  }),
}

const sidebar = [
  Component.PageTitle(),
  Component.Flex({
    components: [
      { Component: Component.Search(), grow: true },
      { Component: Component.Darkmode() },
    ],
  }),
  Component.Explorer({
    title: "Library",
    folderDefaultState: "collapsed",
    folderClickBehavior: "link",
    useSavedState: true,
    filterFn: (node) => node.slugSegment !== "tags",
  }),
]

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.HomeHero(),
      condition: (page) => isIndex(page.fileData.slug),
    }),
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => !isIndex(page.fileData.slug),
    }),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => !isIndex(page.fileData.slug),
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) => !isIndex(page.fileData.slug),
    }),
    Component.ConditionalRender({
      component: Component.TagList(),
      condition: (page) => !isIndex(page.fileData.slug),
    }),
    Component.ConditionalRender({
      component: Component.SharePage(),
      condition: (page) => !isListing(page.fileData.slug),
    }),
    Component.ConditionalRender({
      component: Component.PrintPage(),
      condition: (page) => (page.fileData.frontmatter?.tags ?? []).includes("recipe"),
    }),
    Component.ConditionalRender({
      component: Component.ShareShoppingList(),
      condition: (page) => (page.fileData.frontmatter?.tags ?? []).includes("recipe"),
    }),
  ],
  left: sidebar,
  right: [Component.DesktopOnly(Component.TableOfContents())],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: sidebar,
  right: [],
}
