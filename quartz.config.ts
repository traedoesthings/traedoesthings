import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 *
 * CHANGED for the redesign: pageTitle, typography, colors (Modernist + orange).
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "TraeDoesThings",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "en-US",
    baseUrl: "traedoesthings.pages.dev",
    ignorePatterns: [
      "private",
      "templates",
      ".obsidian",
      "private/**",
      "drafts/**",
      "templates/**",
      "**/.obsidian/**",
      "**/.trash/**",
    ],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Archivo",
        body: "Archivo",
        code: "JetBrains Mono",
      },
      colors: {
        // Light is the secondary theme
        lightMode: {
          light: "#f3f2f2",
          lightgray: "#9f9d9d", // rules / dividers
          gray: "#7d7979",
          darkgray: "#444141", // body text
          dark: "#201e1d", // headings
          secondary: "#a83c00", // links (deep orange for text contrast)
          tertiary: "#e85d04", // hover / brand orange
          highlight: "rgba(232, 93, 4, 0.12)",
          textHighlight: "#e85d0455",
        },
        // Dark is the primary theme
        darkMode: {
          light: "#201e1d",
          lightgray: "#747372", // rules / dividers
          gray: "#9a9796",
          darkgray: "#dcdad9", // body text
          dark: "#f3f2f2", // headings
          secondary: "#ff7a35", // links
          tertiary: "#e85d04", // hover / brand orange
          highlight: "rgba(232, 93, 4, 0.18)",
          textHighlight: "#e85d0466",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
