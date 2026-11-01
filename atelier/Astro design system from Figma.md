# Building a Figma-sourced design system on Astro 7

Snapshot date: 1 November 2026. Target: **Astro 7.4.4**, the current stable release ([npm registry](https://registry.npmjs.org/astro); [Upgrade Astro](https://docs.astro.build/en/upgrade-astro/#documentation-updates)). The brief's "5.x / 6.x" examples are one major out of date. v6 docs are now an "unmaintained v6.4.8 snapshot", v5 docs an "unmaintained v5.18.0 snapshot", and "Both the code and the documentation for earlier versions is unsupported" ([Upgrade Astro](https://docs.astro.build/en/upgrade-astro/#documentation-updates)). Where v6 or v5 behave differently in ways that affect a design system, the difference is called out.

Tag legend: **[Official]** means stated in docs.astro.build or the tool's own docs. **[Ecosystem]** means a maintained third-party tool, cited. **[Practice]** means my reasoned recommendation; it is not an Astro convention. **Unverified** means the research could not confirm it from a primary source.

---

## 0. Executive summary

1. **Astro has no official design-system pattern.** A search of the official docs found no DS, component-library or tokens guide. The closest material is "Component-based design", the styling guide, the TypeScript utilities, npm publishing, and Starlight as a worked example of an overridable component set ([Components](https://docs.astro.build/en/basics/astro-components/#component-based-design)). Everything structural below is therefore [Practice] built from [Official] parts.
2. The working stack: **Figma Variables → DTCG 2025.10 JSON in Git → Style Dictionary or Terrazzo → CSS custom properties → `.astro` components** with scoped `<style>`, typed with `HTMLAttributes`, and following a `class` + `...rest` passthrough contract.
3. The hard constraint is that **`.astro` components cannot be imported inside React/Vue/Svelte components** ([Front-end frameworks](https://docs.astro.build/en/guides/framework-components/#can-i-use-astro-components-inside-my-framework-components)). Your islands policy decides whether you write one implementation per component or two.
4. Figma's REST Variables API is **Enterprise-only** ([Figma Variables API](https://developers.figma.com/docs/rest-api/variables)), and Figma's native JSON export has a disputed DTCG conformance. Below Enterprise, token sync is a manual export committed to Git.
5. **Code Connect has no Astro parser.** Template files (`.figma.ts`), which work with any framework, can emit Astro snippets but require an Org or Enterprise plan ([code-connect README](https://github.com/figma/code-connect)).
6. Testing: Container API + Vitest for render tests (**experimental**), and Playwright for screenshots, axe and keyboard checks against demo routes. Docs: Starlight (official, pre-1.0), or the community `@storybook-astro/framework` if you need a workbench.

**The 5 decisions to make first**

| # | Decision | Branches |
|---|---|---|
| D1 | Islands policy | none → Astro-only components · one framework → shared CSS contract plus a framework twin for interactive parts · mixed → web components or a CSS-only contract (§2, §5) |
| D2 | Consumers / packaging | one site → `src/` folder · 2+ apps → workspace package · need auto-injected CSS or doc routes → package wrapped in an integration (§5) |
| D3 | Styling approach | plain CSS + custom properties · Tailwind 4 mapped via `@theme` (§4a, §9) |
| D4 | Token source and transformer | Figma Enterprise → Terrazzo `tz import` via REST · otherwise → native export or Tokens Studio → Style Dictionary or Terrazzo (§4a) |
| D5 | Docs/workbench | Starlight (narrative docs, live demos, hand-written props tables) · Storybook-Astro (autodocs, controls; community-maintained) (§7) |

**Rule / Decision:** Settle D1–D5 before writing any component; D1 and D2 are the expensive ones to reverse.

---

## 1. How Astro is structured

**Reserved vs conventional.** "The only directory reserved by Astro is `src/pages/`". `components/`, `layouts/` and `styles/` are conventions only [Official] ([Project structure](https://docs.astro.build/en/basics/project-structure/#directories-and-files)). Files in `src/` are processed and bundled. `public/` is copied untouched, and CSS placed there "will not be bundled or optimized" [Official] ([Project structure › public/](https://docs.astro.build/en/basics/project-structure/#public)). The config file can be `.js`, `.mjs` (recommended) or `.ts` ([astro.config.mjs](https://docs.astro.build/en/basics/project-structure/#astroconfigmjs)). v6 removed support for CommonJS config ([v6 Removed](https://docs.astro.build/en/guides/upgrade-to/v6/#removed-support-for-commonjs-config-files)). In v7, **`src/fetch.ts` is reserved** for advanced routing ([v7](https://docs.astro.build/en/guides/upgrade-to/v7/#reserved-file-name-srcfetchts)).

```text
my-site/
├── astro.config.mjs        # integrations, scopedStyleStrategy, fonts, vite plugins
├── tsconfig.json           # extends astro/tsconfigs/{base|strict|strictest}
├── package.json
├── public/                 # copied as-is; never put token CSS here (not bundled)
├── .astro/types.d.ts       # generated types; must be in tsconfig "include" (v5+)
└── src/
    ├── pages/              # ONLY reserved dir; file-based routes (demo/test routes live here)
    ├── components/         # convention: .astro (+ framework) components
    ├── layouts/            # convention: page shells with <slot />; import global CSS here
    ├── styles/             # convention: global.css, generated tokens/*.css
    ├── content.config.ts   # content collections (v5+ location)
    ├── live.config.ts      # live collections (stable v6+, adapter required)
    └── fetch.ts            # RESERVED in v7 (advanced routing); rename/disable via fetchFile
```

Sources: [Project structure](https://docs.astro.build/en/basics/project-structure/#directories-and-files); [Layouts](https://docs.astro.build/en/basics/layouts/); [content.config.ts (v5)](https://docs.astro.build/en/guides/upgrade-to/v5/#breaking-changes-to-legacy-content-and-data-collections); [Live collections](https://docs.astro.build/en/guides/content-collections/#live-content-collections).

**tsconfig.** There are three presets: `base`, `strict` and `strictest`. Astro recommends `strict` or `strictest` if you write TypeScript. Since v5, types come from `.astro/types.d.ts` [Official] ([TypeScript › Setup](https://docs.astro.build/en/guides/typescript/#setup)). `tsc` ignores `.astro` files, so `astro check` is the type gate. `@astrojs/ts-plugin` allows importing `.astro` from `.ts`, which makes barrel re-exports possible [Official] (same source).

**Integrations API.** For a DS, the relevant hook is `astro:config:setup`. It exposes `updateConfig` (deep-merges config, e.g. Vite plugins), `injectScript`, `injectRoute`, `addDevToolbarApp`, `addClientDirective`, `addMiddleware`, `addWatchFile`, `createCodegenDir` and `logger` [Official] ([Integration API](https://docs.astro.build/en/reference/integrations-reference/#astroconfigsetup)). `injectScript('page-ssr', 'import "x.css";')` is documented as "the main use" for injecting global CSS into every page ([injectScript](https://docs.astro.build/en/reference/integrations-reference/#injectscript-option)). `injectRoute` accepts a package export or, since 5.0, a `URL` entrypoint ([injectRoute](https://docs.astro.build/en/reference/integrations-reference/#injectroute-option)). v6 moved Astro onto Vite's Environments API and changed hook and HMR access, and v7 moved to Vite 8. Both mainly break integrations that touch Vite internals [Official] ([v6](https://docs.astro.build/en/guides/upgrade-to/v6/#dependency-upgrades); [v7](https://docs.astro.build/en/guides/upgrade-to/v7/#breaking-changes)).

**Version branches.**

| If you are on | Consequence for the DS |
|---|---|
| **v7 (recommended)** | Rust compiler is the only compiler and errors on invalid HTML; `compressHTML: 'jsx'` default; Container `renderComponent()` available from 7.3.5 ([v7](https://docs.astro.build/en/guides/upgrade-to/v7/#rust-compiler); [Container](https://docs.astro.build/en/reference/container-reference/#rendercomponent)) |
| v6 (unsupported snapshot) | Node ≥ 22.12, Vite 7, Fonts API stable, lenient Go compiler, `compressHTML: true`, no `renderComponent()` ([v6](https://docs.astro.build/en/guides/upgrade-to/v6/#dependency-upgrades)) |
| v5 (unsupported snapshot) | Fonts API experimental, Node 18/20 allowed, `<style>`/`<script>` emitted in reversed order vs v6 ([v6 Changed defaults](https://docs.astro.build/en/guides/upgrade-to/v6/#changed-defaults)) |

**Rule / Decision:** Start on Astro 7 with `astro/tsconfigs/strictest` [Official preset, Practice choice]. Keep all token CSS in `src/`, never in `public/` [Official].

---

## 2. How Astro works, and what each mechanism means for a DS

| Mechanism | What Astro does | DS consequence |
|---|---|---|
| **Build pipeline** | Astro is a Vite app (Vite 7 in v6, Vite 8 in v7) ([v7](https://docs.astro.build/en/guides/upgrade-to/v7/#breaking-changes)). Production CSS is minified and chunked per page; chunks under 4 kB are inlined (`build.inlineStylesheets: 'auto'`) ([Bundle control](https://docs.astro.build/en/guides/styling/#bundle-control); [Config](https://docs.astro.build/en/reference/configuration-reference/#buildinlinestylesheets)) | Pages only pay CSS for the components they render. Token CSS should be one global file imported once, not re-imported per component. |
| **`.astro` model** | Frontmatter (TypeScript, server-only, stripped from output) + an HTML-superset template + scoped `<style>`. "HTML-only templating components with no client-side runtime" ([Components](https://docs.astro.build/en/basics/astro-components/)) | No state and no reactivity. Interactive patterns need native HTML (`<details>`, `<dialog>`, Popover), a deduplicated `<script>` or custom element, or a framework island [Practice]. |
| **Scoped styles** | `h1{}` compiles to `h1[data-astro-cid-…]{}`. Scoped styles do not reach child components. `scopedStyleStrategy` can be `attribute` (default), `class` or `where` (no added specificity) ([Styling](https://docs.astro.build/en/guides/styling/); [Config](https://docs.astro.build/en/reference/configuration-reference/#scopedstylestrategy)) | Component CSS is isolated by default. Consumer overrides need a contract (next row). `where` lets cascade layers decide precedence. |
| **`class` passthrough** | "HTML attributes like `class` do not automatically pass through". Accept `class`, rename it on destructure, and spread `...rest` so the parent's scope attribute reaches the child (not needed with `class`/`where` strategies) ([Passing a class](https://docs.astro.build/en/guides/styling/#passing-a-class-to-a-child-component)) | Every DS component must implement `class` + `...rest`. If it doesn't, consumer overrides fail silently under the default strategy. Make this a lint/review item [Practice]. |
| **Cascade order** | `<link>` < imported CSS < scoped styles. Imported CSS "can leak" even when the component isn't used. Tip: import global CSS in the layout and import the layout first ([Cascading order](https://docs.astro.build/en/guides/styling/#cascading-order)) | Components must not `import` global CSS. Tokens and resets load once from the base layout or an integration. |
| **Typed props** | `interface Props` in frontmatter; `HTMLAttributes<'tag'>`, `Polymorphic`, `HTMLTag` and `ComponentProps` from `astro/types` ([TypeScript](https://docs.astro.build/en/guides/typescript/#component-props); [Type utilities](https://docs.astro.build/en/guides/typescript/#type-utilities)) | Figma variants become literal unions. Native attributes (`aria-*`, `disabled`, `type`) come for free through `HTMLAttributes`. |
| **Slots** | Default and named slots; fallback content; `<slot name="x" slot="x" />` transfer; `Astro.slots.has()` / `Astro.slots.render()`. Named slots only work on an immediate child, with `<Fragment slot>` for groups ([Named slots](https://docs.astro.build/en/basics/astro-components/#named-slots); [Astro.slots](https://docs.astro.build/en/reference/astro-syntax/#component-utilities)) | Figma slots and instance-swap properties map to named slots. "Show X" booleans can be `Astro.slots.has('x')` instead of a prop. Slot names are not type-checked (no typed-slot doc found; unverified for v7). |
| **Scripts** | Processed `<script>` is bundled as a module and **deduplicated per page**; any attribute other than `src` disables processing. Since v5, scripts render where declared ([Scripts](https://docs.astro.build/en/guides/client-side-scripts/#script-processing); [v5](https://docs.astro.build/en/guides/upgrade-to/v5/#script-tags-are-rendered-directly-as-declared)) | Progressive enhancement for N instances costs one script. Use `querySelectorAll` or a custom element, not per-instance IDs [Practice]. |
| **Islands** | Framework components render static HTML unless given `client:load` / `idle` / `visible` / `media` / `only`. Props must be serializable (no functions). `.astro` components can't be hydrated, and can't be imported into framework components; they can only be passed in as children or named slots ([Directives](https://docs.astro.build/en/reference/directives-reference/#client-directives); [Framework components](https://docs.astro.build/en/guides/framework-components/#passing-props-to-framework-components)) | A DS written in `.astro` can't be reused inside React/Vue islands, and callbacks can't cross the boundary. `<Image>`, `<Picture>` and SVG components are also unavailable inside framework components ([Images](https://docs.astro.build/en/guides/images/#images-in-ui-framework-components)). |
| **Rendering modes** | Pages are prerendered by default. On-demand rendering needs an adapter plus `prerender = false` or `output: 'server'`. Server islands (`server:defer`) need an adapter ([On-demand](https://docs.astro.build/en/guides/on-demand-rendering/#enabling-on-demand-rendering); [Server islands](https://docs.astro.build/en/guides/server-islands/)) | DS components are rendering-mode-agnostic. Keep them free of request-dependent logic so they work in both modes [Practice]. |
| **v7 compiler** | Unclosed tags are errors; invalid nesting (`<div>` in `<p>`) is no longer auto-corrected. `compressHTML: 'jsx'` drops whitespace between inline elements. CSS output may be re-serialized cosmetically (`rebeccapurple` → `#639`) ([v7 Rust compiler](https://docs.astro.build/en/guides/upgrade-to/v7/#rust-compiler); [compressHTML](https://docs.astro.build/en/guides/upgrade-to/v7/#new-default-whitespace-handling-compresshtml-jsx)) | Inline compositions (icon + label, badge in text) need explicit `gap` or `{" "}`. Snapshot tests must not assert on exact CSS strings. |

**Islands policy (D1) branches** [Practice, built on the Official constraints above]:
- **No islands:** write all components in `.astro`. Interactivity comes from native HTML plus deduplicated `<script>` or custom elements. JS cost is zero by default.
- **One framework (React, Vue or Svelte):** presentational primitives in `.astro`. Interactive components (combobox, dialog with focus management) get a framework implementation that shares the **same CSS class/data-attribute contract and tokens**, so they look identical. A shared CSS layer is the only way to keep parity across both worlds.
- **Mixed frameworks:** use the same shared CSS contract, plus web components for interactive behaviour. Astro's own dev toolbar ships a small custom-element library, which shows the approach is viable ([Dev Toolbar component library](https://docs.astro.build/en/reference/dev-toolbar-app-reference/#component-library)). There is no dedicated Astro doc on web components as a DS strategy (unverified).

**Rule / Decision:** Every component accepts `class` and spreads `...rest` [Official pattern]. Tokens load once from the layout or an integration [Official tip]. Decide D1 now; under "one framework", the CSS contract is the single source of visual truth [Practice].

---

## 3. Astro features that matter for a DS (status at v7)

| Feature | What it does | DS use | Limits | Source |
|---|---|---|---|---|
| `scopedStyleStrategy` | Picks the scoping mechanism: `attribute`, `class` or `where` | `where` + `@layer` gives predictable overrides | `where` means you manage specificity yourself | [Config](https://docs.astro.build/en/reference/configuration-reference/#scopedstylestrategy) |
| `class:list` | clsx-style class composition (v3+) | Variant and state classes | No `Set`, no dedupe | [Styling](https://docs.astro.build/en/guides/styling/); [v3](https://docs.astro.build/en/guides/upgrade-to/v3/#removed-classlist-features) |
| `define:vars` | Server values → CSS custom properties in `<style>` | Per-instance overrides (e.g. a computed color) | Values are JSON-serialized; on `<script>` it forces `is:inline` | [Directives](https://docs.astro.build/en/reference/directives-reference/#definevars) |
| `astro/types` utilities | `HTMLAttributes`, `HTMLTag`, `Polymorphic`, `ComponentProps` | Native attribute passthrough, `as` prop, typing wrappers | Slots not typed | [Type utilities](https://docs.astro.build/en/guides/typescript/#type-utilities) |
| `astroHTML.JSX` augmentation | Extends global attribute and CSS-property types | Restrict `style={{"--x": …}}` to token names | You maintain the declaration | [Extending global types](https://docs.astro.build/en/guides/typescript/#extending-global-types) |
| `astro check` | Type-checks `.astro` + `.ts`; exits 1 on errors | CI type gate | `astro build` doesn't type-check | [CLI](https://docs.astro.build/en/reference/cli-reference/#astro-check); [Type checking](https://docs.astro.build/en/guides/typescript/#type-checking) |
| Integrations API | `injectScript`, `injectRoute`, `updateConfig`, `addDevToolbarApp` | Auto-inject token CSS, add a `/ds` gallery route, a token-inspector toolbar app | Vite-internal integrations break on majors (v6, v7) | [Integration API](https://docs.astro.build/en/reference/integrations-reference/#astroconfigsetup) |
| Fonts API | Config `fonts: [{ provider, name, cssVariable, … }]` + `<Font cssVariable preload />`; self-hosts files with optimized fallbacks | Typography tokens map to `--font-*` variables | Stable since **6.0**; Google `glyphs` / `variableAxis` still **experimental** | [Fonts](https://docs.astro.build/en/guides/fonts/); [Config › fonts](https://docs.astro.build/en/reference/configuration-reference/#fonts) |
| Content collections | `src/content.config.ts`, `defineCollection({ loader, schema })`, Zod | Docs pages, usage guidelines, token reference data | Content Intellisense and collection storage are **experimental** | [v5](https://docs.astro.build/en/guides/upgrade-to/v5/#experimental-flags); [Content Intellisense](https://docs.astro.build/en/reference/experimental-flags/content-intellisense/) |
| Container API | `experimental_AstroContainer`: `renderToString`, `renderToResponse`; `renderComponent` (7.3.5+) | Render/unit tests in Vitest | **Experimental**; "breaking changes, even in minor or patch releases" | [Container API](https://docs.astro.build/en/reference/container-reference/) |
| Dev toolbar Audit | Automatic a11y and performance audits in dev | Early feedback while authoring | "not a replacement for dedicated tools like Pa11y or Lighthouse" | [Dev toolbar](https://docs.astro.build/en/guides/dev-toolbar/) |
| `astro:assets` | `<Image>`, `<Picture>`, SVG components | Icon and illustration assets | Not usable inside framework components | [Images](https://docs.astro.build/en/guides/images/#images-in-ui-framework-components) |
| `<ClientRouter />` | View transitions with a route announcer; respects `prefers-reduced-motion` | Motion tokens at page level | v7 removed `TRANSITION_*` constants and `createAnimationScope()` | [View transitions](https://docs.astro.build/en/guides/view-transitions/#accessibility); [v7 Removed](https://docs.astro.build/en/guides/upgrade-to/v7/#removed) |
| npm publishing of `.astro` | Ship `.astro`, `.ts`, `.css` source with "no build step" via `exports` | DS package | Consumers compile your source with *their* Astro version | [Publishing](https://docs.astro.build/en/guides/integrations/#publishing-your-component) |
| Tailwind 4 support | `@tailwindcss/vite` via `astro add tailwind` (≥5.2); `@astrojs/tailwind` is **legacy**, Tailwind 3 only | Utilities mapped to tokens | Tailwind's layered rules lose to unlayered CSS | [Tailwind](https://docs.astro.build/en/guides/styling/#tailwind); [Images + Tailwind 4](https://docs.astro.build/en/guides/images/#responsive-images-with-tailwind-4) |
| Deprecated / removed | `Astro.glob()` deprecated in v5 and removed in v6; `<ViewTransitions />` removed in v6; `@astrojs/db` removed in v7 | Avoid in DS docs code | n/a | [v6 Removed](https://docs.astro.build/en/guides/upgrade-to/v6/#removed-astroglob); [v7 Removed](https://docs.astro.build/en/guides/upgrade-to/v7/#removed) |

**Rule / Decision:** Build only on stable features. The Container API is the one experimental dependency worth taking, and only if you pin the Astro version [Practice].

---

## 4. Figma → code bridge

### 4a. Tokens

**Exchange format: W3C DTCG 2025.10.** The Design Tokens Specification 2025.10 is "the first stable release" (28 Oct 2025). It covers theming and multi-brand "without duplicating files", CSS Color 4 spaces (OKLCH, Display P3), aliases and inheritance. Style Dictionary, Tokens Studio and Terrazzo are the named reference implementations [Ecosystem] ([W3C DTCG blog](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/); [designtokens.org](https://designtokens.org/)). DTCG is a W3C Community Group, not a W3C Standard. The resolver/modifier schema in 2025.10 was not fetched (unverified).

**Figma export reality.**

| Path | Plan | Status | Source |
|---|---|---|---|
| Native Variables-panel JSON export/import | Rolled out from late Nov 2025 | Announced as DTCG-aligned. Users report **composite tokens (typography, shadow, gradient) not exported** and export not matching the DTCG format Figma imports. No staff answer. One JSON per mode; import **overwrites** rather than merges | [Forum: Schema recap](https://forum.figma.com/product-updates-3/everything-we-covered-at-schema-by-figma-46763); [Forum: composite export](https://forum.figma.com/suggest-a-feature-11/dtcg-composite-token-export-support-51314); [Atomize (vendor, caution)](https://atomize.tools/blog/figma-variables-export-json/) |
| REST Variables API (`GET` local/published, `POST`) | **Full seat in an Enterprise org** | Stable | [Figma Variables API](https://developers.figma.com/docs/rest-api/variables) |
| Terrazzo `tz import <figma-url>` | REST, so Variables need Enterprise; free plans get Styles only | Writes `*.resolver.json`; "commit to Git, keep import separate from build" | [Terrazzo](https://terrazzo.app/docs/guides/import-from-figma) |
| Tokens Studio plugin | Plugin plans | Exports token sets and variables | [Tokens Studio](https://docs.tokens.studio/figma/export/token-sets) |
| Figma MCP `get_variable_defs` | Starter gets 6 calls/month | Spot checks, not a pipeline; mode coverage is unverified | [Forum: Schema recap](https://forum.figma.com/product-updates-3/everything-we-covered-at-schema-by-figma-46763) |

Mode limits: **10 modes on Professional, 20 on Organization** ([Forum: Schema recap](https://forum.figma.com/product-updates-3/everything-we-covered-at-schema-by-figma-46763)).

**Figma setup branch** [Practice]:
- **Foundations as Variables with modes** (recommended): one collection each for primitives, semantic (modes: light/dark, plus brand if needed), and optionally component tokens. Semantic variables alias primitives. This maps 1:1 to DTCG aliases and one CSS selector block per mode. Set each variable's WEB code syntax to the emitted `var(--ds-…)` name so Dev Mode matches the repo (the `codeSyntax` field was not verified this session; unverified).
- **Styles only**: no modes and no aliases, and on non-Enterprise plans nothing exports through REST. Migrate foundations to Variables before building the pipeline. If that's blocked, author DTCG by hand in the repo and treat Figma as a consumer.

**Repo layout and normalization** [Practice]. Commit DTCG JSON as the contract. Add a `normalize` step between Figma's export and the transformer that resolves cross-collection aliases, hand-authors composites Figma doesn't export (typography, shadow), and strips or maps `$extensions.com.figma`. Style Dictionary ignores that extension by default per a vendor source (unverified against SD docs).

```text
packages/tokens/
├── figma-export/            # raw exports, committed verbatim (one JSON per mode)
├── tokens/                  # normalized DTCG 2025.10 — the contract
│   ├── primitives/color.json
│   ├── primitives/space.json
│   ├── semantic.light.json
│   ├── semantic.dark.json
│   └── components/button.json
├── scripts/normalize.mjs    # raw → DTCG (your code)
├── build-tokens.mjs         # DTCG → CSS
└── dist/tokens.css          # generated; imported once by layout/integration
```

DTCG sample (syntax per the notes; the object form for `dimension` was **not re-verified** against 2025.10):

```json
{
  "color": {
    "$type": "color",
    "brand": { "500": { "$value": "#2f6fed", "$description": "Primary brand blue" } },
    "neutral": { "0": { "$value": "#ffffff" }, "900": { "$value": "#111418" } }
  },
  "semantic": {
    "bg":     { "$type": "color", "$value": "{color.neutral.0}" },
    "fg":     { "$type": "color", "$value": "{color.neutral.900}" },
    "accent": { "$type": "color", "$value": "{color.brand.500}" }
  },
  "space": { "$type": "dimension", "md": { "$value": { "value": 16, "unit": "px" } } }
}
```

**Transform branch (D4).**

| If | Then | Tag |
|---|---|---|
| Figma Enterprise and you want CI pulls | Terrazzo: `tz import <url> --output ds.resolver.json`, then `defineConfig({ tokens: ['ds.resolver.json'] })` from `@terrazzo/cli`; auth via `FIGMA_ACCESS_TOKEN` / `FIGMA_OAUTH_TOKEN` | [Ecosystem] ([Terrazzo](https://terrazzo.app/docs/guides/import-from-figma)). Terrazzo's CSS plugin mode/selector options are **unverified** |
| Non-Enterprise, native export or Tokens Studio | Style Dictionary (DTCG-aware), with `@tokens-studio/sd-transforms` if the source is Tokens Studio | [Ecosystem] ([W3C DTCG blog](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/)). SD v4/v5 API details **unverified** (styledictionary.com not fetchable) |

Style Dictionary build. **Warning: this config comes from prior knowledge of the SD v4 API and was not checked against current docs.** Verify `new StyleDictionary`, `buildAllPlatforms`, `outputReferences` and DTCG object-dimension handling at styledictionary.com before use. [Practice, unverified]

```js
// packages/tokens/build-tokens.mjs  — UNVERIFIED against current Style Dictionary docs
import StyleDictionary from 'style-dictionary';

const modes = [
  { name: 'light', selector: ':root, [data-theme="light"]' },
  { name: 'dark',  selector: '[data-theme="dark"]' },
];

for (const { name, selector } of modes) {
  const sd = new StyleDictionary({
    source: ['tokens/primitives/**/*.json', `tokens/semantic.${name}.json`, 'tokens/components/**/*.json'],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix: 'ds',
        buildPath: 'dist/',
        files: [{
          destination: `${name}.css`,
          format: 'css/variables',
          // dark file emits only semantic overrides; primitives/components come from light
          filter: (t) => t.path[0] === 'semantic' || name === 'light',
          options: { selector, outputReferences: true },
        }],
      },
    },
  });
  await sd.buildAllPlatforms();
}
```

`outputReferences: true` keeps alias chains as `var()`, so a mode switch only overrides the semantic layer. The flip side: when filtering removes tokens that other tokens reference, SD warns about broken references [Ecosystem] ([Always Twisted pt. 10](https://www.alwaystwisted.com/articles/a-design-tokens-workflow-part-10)). Here the dark file's references resolve at runtime against variables defined in the light `:root` block, which is intended.

**Theming in CSS** [Practice]. Mode = selector block (`:root` / `[data-theme="dark"]`). To follow the OS setting, wrap the dark block in `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }`. An alternative is `light-dark()` in a single file, though its Baseline status was **unverified** this session. To avoid a flash of the wrong theme, set `data-theme` on `<html>` from an `is:inline` script in the base layout. `is:inline` leaves the script unprocessed ([Directives](https://docs.astro.build/en/reference/directives-reference/#script--style-directives)); the anti-flash pattern itself is unverified.

**Styling branch (D3).**
- **Plain CSS + custom properties:** components consume `var(--ds-*)` in scoped `<style>`. No dependency, and the DS works in any consumer [Practice].
- **Tailwind 4:** keep the generated `tokens.css` as the source and map it into Tailwind with `@theme inline { --color-primary: var(--ds-semantic-accent); }`. Utilities then resolve to live variables and theming stays in CSS. Astro documents `@theme inline` for referencing a runtime variable ([Fonts › Tailwind](https://docs.astro.build/en/guides/fonts/#register-fonts-in-tailwind)). The general `@theme` vs `@theme inline` semantics are **unverified** (tailwindcss.com not fetched). Components still use scoped CSS with `var()` so non-Tailwind consumers work [Practice].

**Typography tokens via the Fonts API** [Official]: declare families in `fonts` with `cssVariable: '--font-…'` and place `<Font cssVariable="--font-…" preload />` in `<head>`. Semantic typography tokens then reference that variable ([Fonts](https://docs.astro.build/en/guides/fonts/)).

### 4b. Components: Figma → Astro props and slots

Figma slots entered **open beta on 5 Mar 2026** ([Forum](https://forum.figma.com/product-updates-3/slots-is-rolling-out-in-open-beta-51584)). A third-party claim of GA conflicts with this; treat slots as beta.

| Figma construct | Astro construct | Notes |
|---|---|---|
| Variant property (enum) | Literal-union prop, rendered as `data-*` attribute or class | Figma values map to kebab-case code values [Practice] |
| Interaction-state variants (Hover, Focus, Pressed) | **Not props.** CSS `:hover`, `:focus-visible`, `:active` | Exception: `disabled`, which is a native attribute through `HTMLAttributes` [Practice] |
| Boolean property toggling a layer | `Astro.slots.has('x')` on a named slot, or a `boolean` prop when there is no content | [Official API](https://docs.astro.build/en/reference/astro-syntax/#component-utilities), [Practice] mapping |
| Text property | Default slot (rich content) or `string` prop (plain attribute text, e.g. `aria-label`) | |
| Instance-swap property | Named slot (`<slot name="icon" />`) | Named slot content must be an immediate child ([Named slots](https://docs.astro.build/en/basics/astro-components/#named-slots)) |
| Nested instance with exposed props | Child component composed internally; forward props via `ComponentProps<typeof Child>` | [Type utilities](https://docs.astro.build/en/guides/typescript/#type-utilities) |
| Figma slot (beta) | Default or named `<slot />`, with fallback content | [Fallback](https://docs.astro.build/en/basics/astro-components/#fallback-content-for-slots) |
| Variable-bound fill, spacing, radius | `var(--ds-…)`; never a literal value | Enforced by Stylelint (§9) |

### 4c. Figma Code Connect and Astro

Facts:
- **No Astro parser exists.** The existing parsers are React, HTML (Web Components/Angular/Vue), SwiftUI and Compose, and they "will no longer receive updates". "Template files are now the only actively maintained way of using Code Connect". The CLI requires **Organization or Enterprise** with a full Design or Dev Mode seat [Official Figma] ([code-connect README](https://github.com/figma/code-connect)).
- **Template files** (`.figma.ts`) "connect any codebase, regardless of framework". The API includes `figma.selectedInstance`, `getString`, `getBoolean`, `getEnum`, `findInstance` + `executeTemplate`, `getSlot`, and a `figma.code` tagged template. Configure through `figma.config.json` → `codeConnect.include`, `label`, `language`, and publish with `npx figma connect publish` [Official Figma] ([Template files](https://developers.figma.com/docs/code-connect/template-files/)).
- **Code Connect UI** (no-code path mapping) works on **Professional, Organization and Enterprise** (Professional: 1 library, 1 framework). Its mappings feed the MCP server, but "don't show code snippets in the Inspect panel" [Official Figma] ([Code Connect UI](https://developers.figma.com/docs/code-connect/code-connect-ui-setup/)).
- Whether `language: "astro"` gets syntax highlighting in Dev Mode is **unverified**. Use `html` or `jsx`.

**Branches** [Practice]: Org/Enterprise → template files per component, reviewed like code, with `@figma/code-connect` pinned. Professional → Code Connect UI for agent/MCP grounding plus a docs link in each Figma component description. Starter → docs links only. Avoid wrapping components as web components just to use the frozen HTML parser.

### 4d. Sync workflow and drift detection

**Ownership** [Practice]: design owns the token values and component specs in Figma; code owns the DTCG normalization, transforms and components. Each layer has one source of truth. Don't use the `POST` Variables API to push code → Figma unless you deliberately move token ownership to code, because two-way sync creates conflicts.

**Order of change** [Practice]: (1) designer edits Variables and publishes the library; (2) export lands in `figma-export/`; (3) `normalize` + `build` produce a JSON diff and a CSS diff in one PR; (4) visual regression runs; (5) the DS owner merges; (6) a changeset determines the version bump (§9).

| Plan | Trigger | Drift detection |
|---|---|---|
| Enterprise | `LIBRARY_PUBLISH` webhook (payload lists `created_variables` / `modified_variables` / `deleted_variables`), or `FILE_VERSION_UPDATE` (which Figma suggests for "triggering asset builds") → CI runs `tz import` / REST → bot PR [Official Figma] ([Webhooks events](https://developers.figma.com/docs/rest-api/webhooks-events)) | Automatic: any publish produces a PR. Webhook plan requirements are **unverified** |
| Non-Enterprise | Designer exports via the Variables panel, or Tokens Studio Git sync → PR | Manual. A scheduled staleness check isn't possible without REST. Catch drift at review, through visual regression, and with MCP spot checks [Practice] |
| Design side | Figma "Check designs" (early access) flags layers that should use variables or styles ([Forum](https://forum.figma.com/product-updates-3/everything-we-covered-at-schema-by-figma-46763)) | Design-side linting |

No off-the-shelf tool for detecting token drift between Figma and code was found (gap).

**Rule / Decision:** DTCG JSON committed to Git is the contract [Practice]. Pick the token pipeline by Figma plan (Enterprise → Terrazzo REST; otherwise → export or Tokens Studio → Style Dictionary) [Ecosystem]. Pick the Code Connect form by plan [Official Figma]. Never let interaction states become props [Practice].

---

## 5. Architecture

Astro's official guidance covers publishing `.astro` source to npm with "no build step" via `package.json` `exports`, and recommends a workspaces monorepo (`demo/` + `packages/*`) [Official] ([Publishing](https://docs.astro.build/en/guides/integrations/#publishing-your-component); [package.json](https://docs.astro.build/en/guides/integrations/#packagejson)). Starlight shows the "integration + component subpath export" pattern: `starlight({...})` in `integrations`, components from `@astrojs/starlight/components`, and theming through custom properties and `@layer base, starlight, theme, components, utilities;` [Ecosystem] ([Starlight CSS](https://starlight.astro.build/guides/css-and-tailwind/#styling-starlight-with-tailwind)).

| Option | Fits CONTEXT branch | Pros | Cons | Tag |
|---|---|---|---|---|
| **In-site folder** (`src/components/ds/`, `src/styles/tokens/`) | Consumers = one site | Zero packaging; `tsconfig` `paths` alias `@ds/*` ([Import aliases](https://docs.astro.build/en/guides/typescript/#import-aliases)) | Extracting later costs a refactor; versioning, docs and tests are mixed with app code | [Official] mechanics, [Practice] choice |
| **Monorepo package** (`packages/ui`, `packages/tokens`) | Consumers = 2+ apps, or one site with a separate docs app | Source shipped without a build; explicit `exports`; independent versioning | Consumers compile your `.astro` with their Astro version, so a peer range and CI matrix are needed | [Official] publishing, [Practice] peer range |
| **Package + thin integration** | 2+ apps **and** you want auto-injected token CSS, a Tailwind Vite plugin, or `/ds` gallery routes | One line in consumer config; `injectScript('page-ssr', …)`, `injectRoute`, `updateConfig` | Integration code breaks on Vite-internal majors (v6, v7); one more API surface to maintain | [Official] hooks, [Ecosystem] Starlight precedent |

Islands interaction: under D1 "one framework", add `packages/ui-react` (or similar) sharing `packages/tokens` and the CSS contract. The official `exports` example already shows `./astro` and `./react` subpaths in one package [Official] ([package.json](https://docs.astro.build/en/guides/integrations/#packagejson)).

Recommended tree for the multi-consumer branch [Practice]. For a single site, collapse `packages/ui/src` into `src/components/ds` and `packages/tokens` into `src/styles/tokens`.

```text
ds/
├── package.json                 # workspaces; engines.node ">=22.12"
├── .changeset/                  # versioning (§9)
├── packages/
│   ├── tokens/                  # §4a: figma-export/ → tokens/ (DTCG) → dist/tokens.css
│   └── ui/
│       ├── package.json         # exports per component; peerDependencies.astro "^7"
│       ├── src/
│       │   ├── styles/layers.css        # @layer order + reset
│       │   ├── components/Button/
│       │   │   ├── Button.astro
│       │   │   ├── Button.figma.ts      # Code Connect template (Org/Enterprise)
│       │   │   └── Button.test.ts       # Container API test
│       │   └── index.ts                 # optional barrel (needs @astrojs/ts-plugin in editor)
│       └── integration.mjs      # optional thin integration
└── apps/
    └── docs/                    # Starlight (or Storybook-Astro) + /test/* demo routes for Playwright
```

`packages/ui/package.json`, adapted from the official example. **`peerDependencies` and `engines` are [Practice]**: the official snippet does not include `peerDependencies` ([package.json](https://docs.astro.build/en/guides/integrations/#packagejson)).

```json
{
  "name": "@ds/ui",
  "version": "0.1.0",
  "type": "module",
  "exports": {
    "./Button.astro": "./src/components/Button/Button.astro",
    "./styles/layers.css": "./src/styles/layers.css"
  },
  "files": ["src"],
  "keywords": ["astro-component", "withastro", "ui", "css"],
  "peerDependencies": { "astro": "^7.0.0" },
  "engines": { "node": ">=22.12.0" }
}
```

Optional integration. [Practice] composition of the documented hooks; the hook names and signatures are [Official] ([Integration API](https://docs.astro.build/en/reference/integrations-reference/#astroconfigsetup)):

```js
// packages/ui/integration.mjs
export default function ds() {
  return {
    name: '@ds/ui',
    hooks: {
      'astro:config:setup': ({ injectScript, injectRoute }) => {
        injectScript('page-ssr', 'import "@ds/tokens/dist/tokens.css";');
        injectRoute({
          pattern: '/ds',
          entrypoint: new URL('./src/gallery.astro', import.meta.url), // URL entrypoint since 5.0
        });
      },
    },
  };
}
```

Naming conventions [Practice]: CSS custom properties `--ds-{tier}-{path}` (`--ds-semantic-accent`, `--ds-button-primary-bg`); component root class `ds-{component}` with BEM-ish children (`ds-button__label`), because unique class names guard against parent-scope bleed under the default strategy ([Passing a class](https://docs.astro.build/en/guides/styling/#passing-a-class-to-a-child-component)); variants as `data-{prop}` attributes; files `PascalCase.astro`, one folder per component; Figma component and property names identical to code names, apart from case.

**Rule / Decision:** If consumers = 1 → in-site folder. If 2+ → workspace package. Add the integration wrapper only when you need injection or routes [Practice on Official mechanics]. Declare an `astro` peer range and `engines.node >=22.12` [Practice].

---

## 6. Component authoring standard

**Config baseline** [Practice; option is Official]. Use `where` so component selectors add no specificity and `@layer` order decides precedence ([scopedStyleStrategy](https://docs.astro.build/en/reference/configuration-reference/#scopedstylestrategy)):

```js
// astro.config.mjs (consumer app)
import { defineConfig } from 'astro/config';
export default defineConfig({
  scopedStyleStrategy: 'where',
});
```

```css
/* @ds/ui/styles/layers.css — imported once in the base layout, before anything else */
@layer reset, tokens, components, utilities;
```

Astro has no documented cascade-layer feature. `@layer` is plain CSS passing through Vite, and the research could not verify that behaviour beyond the `scopedStyleStrategy` doc (**unverified**). Under the Tailwind branch this matters: Tailwind 4 rules are layered and lose to unlayered CSS ([Images + Tailwind 4](https://docs.astro.build/en/guides/images/#responsive-images-with-tailwind-4)). Component styles must therefore sit in a layer *below* `utilities`, or utility overrides won't apply.

**File template rules** [Practice unless tagged]:
1. `interface Props extends HTMLAttributes<'tag'>`, plus literal unions for Figma variants, with JSDoc on every prop. JSDoc feeds Storybook-Astro autodocs [Ecosystem] ([roadmap](https://raw.githubusercontent.com/storybook-astro/storybook-astro/main/apps/website/src/content/docs/guides/roadmap.md)).
2. Destructure `class: className` and `...rest`; spread `rest` on the root element [Official pattern].
3. Variant API: `data-variant` / `data-size` on the root, with defaults set at destructure. No boolean flag per variant.
4. Styling: scoped `<style>` wrapped in `@layer components`; only `var(--ds-*)` values for color, space, radius, type, shadow and motion; no global CSS imports; `gap` instead of whitespace for inline composition (v7 `compressHTML: 'jsx'`).
5. Interactivity: native element first, then one processed `<script>` (deduplicated per page [Official]), then a framework twin per D1.
6. Valid HTML nesting, because the v7 compiler errors instead of correcting [Official].

**Accessibility requirements** [Practice]: native semantics (`<button>`, not `<div role="button">`); visible `:focus-visible` using a focus token; a disabled state through the native attribute; an accessible name required (text slot, or `aria-label` for icon-only); decorative icons `aria-hidden="true"`; contrast verified per mode; respect `prefers-reduced-motion`.

**Definition of done** [Practice]: Figma component and code share names and property maps · tokens exist in DTCG and build clean · `astro check --minimumFailingSeverity warning` passes · ESLint + Stylelint (token rules) pass · Container test · demo route with screenshot and axe test green in every mode · docs page with usage, do/don't and props table · Code Connect template or docs link · changeset added.

### Worked example: Button, end to end

**1. Figma spec** (component set `Button`)

| Figma property | Type | Values | Code |
|---|---|---|---|
| Variant | Variant | Primary, Secondary | `variant: 'primary' \| 'secondary'` → `data-variant` |
| Size | Variant | Small, Medium | `size: 'sm' \| 'md'` → `data-size` |
| State | Variant | Default, Hover, Focus, Disabled | `:hover`, `:focus-visible`, native `disabled` (not a prop) |
| Label | Text | — | default slot |
| Show icon | Boolean | — | `Astro.slots.has('icon')` |
| Icon | Instance swap | Icon/* | named slot `icon` |
| Fills / padding / radius | Bound variables | `button/*` collection | `--ds-button-*` |

**2. Tokens** (`packages/tokens/tokens/components/button.json`, DTCG). Semantic `on-accent` and `focus` are assumed to exist alongside the semantic sample in §4a. The `dimension` object form is **unverified** against 2025.10 and your transformer.

```json
{
  "button": {
    "primary": {
      "bg": { "$type": "color", "$value": "{semantic.accent}" },
      "fg": { "$type": "color", "$value": "{semantic.on-accent}" }
    },
    "secondary": {
      "bg": { "$type": "color", "$value": "{semantic.bg}" },
      "fg": { "$type": "color", "$value": "{semantic.accent}" },
      "border": { "$type": "color", "$value": "{semantic.accent}" }
    },
    "focus-ring": { "$type": "color", "$value": "{semantic.focus}" },
    "radius": { "$type": "dimension", "$value": { "value": 8, "unit": "px" } },
    "padding-inline": {
      "md": { "$type": "dimension", "$value": "{space.md}" },
      "sm": { "$type": "dimension", "$value": { "value": 8, "unit": "px" } }
    }
  }
}
```

Expected output shape with `prefix: 'ds'` and `outputReferences: true`. This is illustrative; exact naming depends on the transformer's name transform and is **unverified**:

```css
:root, [data-theme="light"] {
  --ds-color-brand-500: #2f6fed;
  --ds-semantic-accent: var(--ds-color-brand-500);
  --ds-button-primary-bg: var(--ds-semantic-accent);
  --ds-button-radius: 8px;
  /* … */
}
```

**3. `Button.astro`** [Practice composition; every API used is Official: `HTMLAttributes` ([Type utilities](https://docs.astro.build/en/guides/typescript/#type-utilities)), `class`/`...rest` ([Passing a class](https://docs.astro.build/en/guides/styling/#passing-a-class-to-a-child-component)), `class:list` ([Styling](https://docs.astro.build/en/guides/styling/)), `Astro.slots.has` ([Astro.slots](https://docs.astro.build/en/reference/astro-syntax/#component-utilities))]

```astro
---
import type { HTMLAttributes } from 'astro/types';

interface Props extends HTMLAttributes<'button'> {
  /** Visual emphasis. Figma: Variant (Primary | Secondary). */
  variant?: 'primary' | 'secondary';
  /** Figma: Size (Small | Medium). */
  size?: 'sm' | 'md';
}

const {
  variant = 'primary',
  size = 'md',
  type = 'button',
  class: className,
  ...rest
} = Astro.props;

const hasIcon = Astro.slots.has('icon');
---
<button
  type={type}
  class:list={['ds-button', className]}
  data-variant={variant}
  data-size={size}
  {...rest}
>
  {hasIcon && <span class="ds-button__icon" aria-hidden="true"><slot name="icon" /></span>}
  <span class="ds-button__label"><slot /></span>
</button>

<style>
  @layer components {
    .ds-button {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-space-xs);
      border: 1px solid transparent;
      border-radius: var(--ds-button-radius);
      padding-inline: var(--ds-button-padding-inline-md);
      background: var(--ds-button-primary-bg);
      color: var(--ds-button-primary-fg);
      font: inherit;
      cursor: pointer;
    }
    .ds-button[data-size='sm'] { padding-inline: var(--ds-button-padding-inline-sm); }
    .ds-button[data-variant='secondary'] {
      background: var(--ds-button-secondary-bg);
      color: var(--ds-button-secondary-fg);
      border-color: var(--ds-button-secondary-border);
    }
    .ds-button:focus-visible {
      outline: 2px solid var(--ds-button-focus-ring);
      outline-offset: 2px;
    }
    .ds-button:disabled { cursor: not-allowed; opacity: 0.5; }
  }
</style>
```

Design notes [Practice]: `type="button"` defaults away the implicit-submit footgun. `disabled`, `aria-*` and `form` pass through `rest`. `gap` replaces whitespace, which v7's `compressHTML: 'jsx'` would collapse. `--ds-space-xs` is assumed to exist in primitives. Under the default `attribute` strategy, `className` still works because `rest` carries the parent's scope attribute. Icon-only usage requires `aria-label`, which is enforced in docs and review, not by types. Links get a separate `LinkButton` (or `Polymorphic` `as`) rather than `href` on `<button>`.

Code Connect template (Org/Enterprise). Adapted from the documented API; **not tested**; `language` highlighting for Astro is **unverified** [Official Figma API, Practice usage] ([Template files](https://developers.figma.com/docs/code-connect/template-files/)):

```ts
// packages/ui/src/components/Button/Button.figma.ts
// url=https://www.figma.com/design/FILEKEY/DS?node-id=12-34
import figma from 'figma'
const i = figma.selectedInstance
const label = i.getString('Label')
const variant = i.getEnum('Variant', { Primary: 'primary', Secondary: 'secondary' })
const size = i.getEnum('Size', { Small: 'sm', Medium: 'md' })
export default {
  example: figma.code`<Button variant="${variant}" size="${size}">${label}</Button>`,
  imports: ['import Button from "@ds/ui/Button.astro"'],
  id: 'button',
  metadata: { nestable: true },
}
```

**4. Docs entry** (Starlight branch). Starlight renders components in MDX [Official Starlight] ([Using components](https://raw.githubusercontent.com/withastro/starlight/main/docs/src/content/docs/components/using-components.mdx)). The `src/content/docs/` location is the Starlight convention but was not re-verified in this research. The props table is hand-written because no `.astro` docgen exists outside Storybook-Astro (§7).

````mdx
---
title: Button
---
import Button from '@ds/ui/Button.astro';

Triggers an action in place. For navigation, use `LinkButton`.

<Button>Save</Button> <Button variant="secondary">Cancel</Button>

```astro
<Button variant="primary" size="md">Save</Button>
```

| Prop | Type | Default | Figma |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary'` | `'primary'` | Variant |
| `size` | `'sm' \| 'md'` | `'md'` | Size |
| `icon` slot | element | — | Show icon + Icon |
| …native | `HTMLAttributes<'button'>` | `type="button"` | — |

**Do:** one primary per view. **Don't:** icon-only without `aria-label`.
````

**5. Tests**

Render test: Container API + Vitest. **Experimental API** [Official] ([Container API](https://docs.astro.build/en/reference/container-reference/); [Testing guide](https://docs.astro.build/en/guides/testing)).

```ts
// packages/ui/vitest.config.ts
/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';
export default getViteConfig({ test: { environment: 'node' } });
```

```ts
// packages/ui/src/components/Button/Button.test.ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, expect, test } from 'vitest';
import Button from './Button.astro';

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create(); // no renderers: Button is pure .astro
});

test('defaults: primary, md, type=button, no icon wrapper', async () => {
  const html = await container.renderToString(Button, { slots: { default: 'Save' } });
  expect(html).toContain('Save');
  expect(html).toContain('data-variant="primary"');
  expect(html).toContain('data-size="md"');
  expect(html).toContain('type="button"');
  expect(html).not.toContain('ds-button__icon');
});

test('forwards variant, class and native attributes', async () => {
  const html = await container.renderToString(Button, {
    props: { variant: 'secondary', disabled: true, class: 'extra', 'aria-label': 'Close' },
    slots: { default: 'x' },
  });
  expect(html).toContain('data-variant="secondary"');
  expect(html).toMatch(/class="[^"]*ds-button[^"]*extra/);
  expect(html).toContain('disabled');
  expect(html).toContain('aria-label="Close"');
});
```

Assert on attributes and content, never on emitted CSS strings, because the v7 compiler may re-serialize CSS ([v7](https://docs.astro.build/en/guides/upgrade-to/v7/#rust-compiler)) [Practice].

Demo route + visual + a11y: Playwright with `toHaveScreenshot()` and `@axe-core/playwright` [Ecosystem] ([Playwright snapshots](https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/test-snapshots-js.md); [axe-core Playwright](https://raw.githubusercontent.com/dequelabs/axe-core-npm/develop/packages/playwright/README.md)). Playwright `webServer` config per the Astro testing guide [Official] ([Testing](https://docs.astro.build/en/guides/testing)).

```astro
---
// apps/docs/src/pages/test/button.astro — demo matrix used only by tests
import Button from '@ds/ui/Button.astro';
---
<html lang="en" data-theme={Astro.url.searchParams.get('theme') ?? 'light'}>
  <head><title>Button test</title></head>
  <body>
    <div data-testid="demo" style="display:flex;gap:1rem;padding:1rem">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button size="sm">Small</Button>
      <Button disabled>Disabled</Button>
    </div>
  </body>
</html>
```

`Astro.url.searchParams` only reflects the query string under on-demand rendering. With the default prerendering, generate one static route per theme (e.g. `/test/button-dark`) instead (**unverified** detail; [Practice] workaround). Tokens CSS reaches this page through the layout or the integration's `page-ssr` injection.

```ts
// apps/docs/e2e/button.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('button: visual baseline', async ({ page }) => {
  await page.goto('/test/button');
  await expect(page).toHaveScreenshot();
});

test('button: no axe violations', async ({ page }) => {
  await page.goto('/test/button');
  const results = await new AxeBuilder({ page }).include('[data-testid="demo"]').analyze();
  expect(results.violations).toEqual([]);
});

test('button: keyboard focus is visible', async ({ page }) => {
  await page.goto('/test/button');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Primary' })).toBeFocused();
});
```

`.withTags([...])` (WCAG tag filtering) is part of AxeBuilder from prior knowledge but was **unverified** for 4.14, so it's omitted above. Generate screenshot baselines in the same pinned CI image that compares them ([Playwright](https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/test-snapshots-js.md)).

**Rule / Decision:** No component merges without the full DoD. Button is the template every later component copies: same Props shape, `class` + `rest`, `data-*` variants, a layered scoped style, a Container test and a demo route [Practice].

---

## 7. Documentation

| Option | Maturity (Nov 2026) | Live demos | Props tables | Controls | Setup cost | Tag |
|---|---|---|---|---|---|---|
| **Starlight** | Official Astro project, **pre-1.0** (0.42.8, peer `astro ^7.2.10`) ([npm](https://registry.npmjs.org/@astrojs/starlight)) | Free: it is Astro; MDX renders `.astro` and framework components | **Hand-written**; no `.astro` docgen package exists ([npm search](https://registry.npmjs.org/-/v1/search?text=astro%20props%20table&size=8)) | None | Low | [Official] |
| **Storybook 10 + `@storybook-astro/framework`** | Community, v1.14.0, first beta Feb 2026, releases every few weeks; **no official `@storybook/astro`** ([npm](https://registry.npmjs.org/@storybook-astro/framework); [npm](https://registry.npmjs.org/@storybook/astro)) | Through the Container API; "a few seconds per render" in dev | **Autodocs from JSDoc in frontmatter** (types, defaults, union selects) | Disabled for Astro stories in static builds; live only with `renderMode: 'server'` ("In Progress", needs a Node server) | Medium: manual setup (`create storybook` doesn't detect Astro); `astro:assets` and Fonts partial | [Ecosystem] ([README](https://raw.githubusercontent.com/storybook-astro/storybook-astro/main/README.md); [roadmap](https://raw.githubusercontent.com/storybook-astro/storybook-astro/main/apps/website/src/content/docs/guides/roadmap.md)) |
| **Custom docs on content collections** | Official primitives (`defineCollection`, Zod) | Free | Hand-written or your own extractor | None | High: you build nav, search and layout | [Official] primitives, [Practice] build |
| Histoire / Ladle | No Astro support (Histoire: Vue/React/Svelte; Ladle: React) | — | — | — | n/a | ([Histoire](https://raw.githubusercontent.com/histoire-dev/histoire/main/README.md); [Ladle](https://registry.npmjs.org/@ladle/react)) |

Starlight details: live preview next to code isn't a built-in primitive. Starlight's own docs use a project-local `component-preview.astro` with `slot="preview"`, and `<Code>` renders highlighted source from strings ([code.mdx](https://raw.githubusercontent.com/withastro/starlight/main/docs/src/content/docs/components/code.mdx)). Plugins are available: `starlight-typedoc`, `starlight-links-validator` ([npm](https://registry.npmjs.org/-/v1/search?text=starlight%20component%20preview&size=8)). `starlight-typedoc` documents TS, not `.astro` Props (inference).

**Recommendation: Starlight** [Practice]. It's official, cheap, and matches the zero-JS model. Narrative content (tokens, guidelines, do/don't, Figma mapping) is most of what a Figma-led DS documents. Its limits: pre-1.0 (expect breaking minors), no props docgen, no controls, and live preview is a component you write.

**Switch branch:** if developers need an isolated workbench with generated props tables, or your D1 involves heavy framework islands, add Storybook-Astro **next to** Starlight (guidelines in Starlight, workbench in Storybook, cross-linked) [Practice]. Accept its community single-maintainer risk, and pin the version.

**Rule / Decision:** Use Starlight for docs, with a hand-maintained props table per component checked at review. Add Storybook-Astro only on explicit workbench demand [Practice].

---

## 8. Testing

| Layer | Tool | What it catches | Maturity | Setup cost |
|---|---|---|---|---|
| Types | `astro check` | Prop misuse, missing required props, type errors in `.astro` | Official, stable ([CLI](https://docs.astro.build/en/reference/cli-reference/#astro-check)) | Trivial |
| Render/unit | Container API + Vitest via `getViteConfig()` | Markup contract: attributes, classes, slot output, defaults | Official but **`experimental_`**; may break in minor/patch ([Container](https://docs.astro.build/en/reference/container-reference/)) | Low |
| Render incl. inline CSS/JS | `renderComponent()` with `?container` import (7.3.5+) | Output including inlined scripts and styles; not `@import`-ed assets | Experimental, v7 only ([renderComponent](https://docs.astro.build/en/reference/container-reference/#rendercomponent)) | Low |
| Visual regression | Playwright `toHaveScreenshot()` on demo routes | Token, CSS and layout regressions across modes | Stable, built-in ([Playwright](https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/test-snapshots-js.md)) | Low (pin CI image) |
| Visual (SaaS) | Chromatic via `@chromatic-com/playwright` 1.0.0, or Percy `@percy/playwright` 1.1.2 | Same, plus a review UI and cross-browser | Commercial; no Storybook needed for Chromatic ([Chromatic](https://chromatic.com/blog/how-to-visual-test-ui-using-playwright)) | Low–medium, paid (pricing not retrieved) |
| Visual (avoid) | Lost Pixel, BackstopJS | — | Last releases 2024 ([npm](https://registry.npmjs.org/lost-pixel); [npm](https://registry.npmjs.org/backstopjs)) | Maintenance risk |
| Automated a11y | `@axe-core/playwright` 4.14.0 | WCAG rule violations in rendered DOM | Deque, active ([README](https://raw.githubusercontent.com/dequelabs/axe-core-npm/develop/packages/playwright/README.md)) | Low |
| a11y (page level) | pa11y 10 / pa11y-ci 5 | Site-wide crawl checks | Active again ([npm](https://registry.npmjs.org/pa11y-ci)) | Low |
| a11y (dev only) | Astro dev toolbar Audit | Common issues while authoring | Built-in; "not a replacement" ([Dev toolbar](https://docs.astro.build/en/guides/dev-toolbar/)) | Zero |
| E2E / interaction | Playwright (1.64) against `npm run preview` | Keyboard and focus behaviour, hydrated islands, scripts | Official guide config ([Testing](https://docs.astro.build/en/guides/testing)) | Low |
| Storybook path | `@storybook/addon-vitest` + play functions | Story-level interaction tests on Astro 5/6/7 | Community; story globs must be relative or stories "are silently untested" ([roadmap](https://raw.githubusercontent.com/storybook-astro/storybook-astro/main/apps/website/src/content/docs/guides/roadmap.md)) | Medium |

Caveats: the Container API returns strings, not a DOM. Run DOM-level assertions in Playwright (Practice; no official guidance). `@storybook/addon-a11y` with Storybook-Astro is **unverified**. Vitest ≥ 4.1 is required for the Storybook-Astro portable-stories path because Vitest 4.0.x externalized `astro` ([testing guide](https://raw.githubusercontent.com/storybook-astro/storybook-astro/main/apps/website/src/content/docs/guides/testing.md)). There is no official Vitest 5 compatibility statement from Astro (unverified). Cypress component testing of `.astro` is unsupported by any evidence found.

**Rule / Decision:** Use three gates per component: Container render test, Playwright screenshot plus axe on one demo route per mode, and Playwright keyboard checks for anything interactive. Run Playwright against the production build (`astro build` then `preview`) [Practice on Official tooling].

---

## 9. Code consistency and governance

**TypeScript** [Official]: extend `astro/tsconfigs/strictest`. `verbatimModuleSyntax` is on in all presets ([Type imports](https://docs.astro.build/en/guides/typescript/#type-imports)). Run `"build": "astro check && astro build"` ([Type checking](https://docs.astro.build/en/guides/typescript/#type-checking)). `astro check --minimumFailingSeverity warning` fails CI on warnings ([CLI](https://docs.astro.build/en/reference/cli-reference/#astro-check)). Whether `@deprecated` usages surface at warning severity is **unverified**.

```json
{
  "extends": "astro/tsconfigs/strictest",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

Optional token-typed inline styles via the documented global augmentation [Official mechanism, Practice use] ([Extending global types](https://docs.astro.build/en/guides/typescript/#extending-global-types)):

```ts
// src/env.d.ts (or packages/ui/types.d.ts)
declare namespace astroHTML.JSX {
  interface CSSProperties {
    '--ds-demo-accent'?: `var(--ds-${string})`;
  }
}
```

**Linting and formatting.**

| Concern | Tool | Status | Tag |
|---|---|---|---|
| `.astro` + TS lint | `eslint-plugin-astro` (flat config, ESM-only, **ESLint ≥ 10**, Node ≥ 22.22.3); `jsx-a11y-strict` config (needs `eslint-plugin-jsx-a11y`) | Stable | [Ecosystem] ([user guide](https://ota-meshi.github.io/eslint-plugin-astro/user-guide/)) |
| Format | `prettier-plugin-astro` (withastro org) with `parser: 'astro'` override | Stable | [Official] ([repo](https://github.com/withastro/prettier-plugin-astro)) |
| Biome for `.astro` | Biome 2.3 full support behind `html.experimentalFullSupportEnabled` | **Experimental** | [Ecosystem] ([Biome 2.3](https://biomejs.dev/blog/biome-v2-3/)) |
| CSS in `.astro` | Stylelint ≥ 16 + `stylelint-config-html/astro` (postcss-html) | Stable | [Ecosystem] ([stylelint-config-html](https://github.com/ota-meshi/stylelint-config-html)) |
| Token enforcement: no undefined vars | `csstools/value-no-unknown-custom-properties` with `importFrom` → built `tokens.css` (**absolute paths** in monorepos) | Stable | [Ecosystem] ([plugin](https://github.com/csstools/stylelint-value-no-unknown-custom-properties/)) |
| Token enforcement: no raw values | `stylelint-declaration-strict-value` | **Unverified** (rule name and options not checked) | — |

```js
// eslint.config.mjs  [Ecosystem, verbatim pattern from user guide]
import eslintPluginAstro from 'eslint-plugin-astro';
export default [
  ...eslintPluginAstro.configs.recommended,
  { rules: { 'astro/no-set-html-directive': 'error' } },
];
```

```js
// .prettierrc.mjs  [Official plugin, verbatim]
export default {
  plugins: ['prettier-plugin-astro'],
  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
};
```

```js
// stylelint.config.mjs  [Practice composition of Ecosystem configs]
import { fileURLToPath } from 'node:url';
export default {
  extends: ['stylelint-config-html/astro'],
  plugins: ['stylelint-value-no-unknown-custom-properties'],
  rules: {
    'csstools/value-no-unknown-custom-properties': [true, {
      importFrom: [fileURLToPath(new URL('./packages/tokens/dist/tokens.css', import.meta.url))],
    }],
  },
};
```

**CI gates** [Practice]. Composed from documented commands; action versions and the `changeset status --since` flag are **unverified**:

```yaml
name: ci
on: [pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @ds/tokens build          # tokens first: Stylelint imports dist/tokens.css
      - run: pnpm -r exec astro check --minimumFailingSeverity warning
      - run: pnpm eslint .
      - run: pnpm stylelint "**/*.{css,astro}"
      - run: pnpm prettier --check .
      - run: pnpm test                               # Vitest + Container
      - run: pnpm -r build
      - run: pnpm --filter docs exec playwright test # screenshots + axe + keyboard
      - run: pnpm changeset status --since=origin/main
```

**Versioning and changelog** [Ecosystem]: Changesets with `changesets/action@v1`. It opens a "Version Packages" PR and publishes on merge, and needs `GITHUB_TOKEN` and `NPM_TOKEN` ([changesets/action mirror](https://awesome.ecosyste.ms/projects/github.com%2Fchangesets%2Faction)). The mirrored README example uses Node 20, which is EOL; use 22.12+ or 24. Trusted publishing (OIDC) support is **unverified**.

**Deprecation workflow**, modelled on Astro's own semver policy: deprecate in a minor "with a warning", remove in a major, document in an upgrade guide [Official policy] ([Semantic versioning](https://docs.astro.build/en/upgrade-astro/#semantic-versioning)). The component-level pattern below is [Practice]:

```astro
---
interface Props {
  /** @deprecated Use `variant="primary"`. Removed in 2.0.0. */
  primary?: boolean;
  variant?: 'primary' | 'secondary';
}
const { primary, variant = primary ? 'primary' : 'secondary' } = Astro.props;
if (import.meta.env.DEV && primary !== undefined) {
  console.warn('[ds/Button] `primary` is deprecated; use variant="primary".');
}
---
```

**Contribution flow** [Practice]: a proposal issue with the Figma link → the Figma component reaches "Ready for dev" (Dev Mode status, which emits `DEV_MODE_STATUS_UPDATE` webhooks on Enterprise ([Webhooks](https://developers.figma.com/docs/rest-api/webhooks-events))) → a PR meeting the DoD with a changeset → review by the DS owner (design) and a code owner → release PR.

**Rule / Decision:** CI blocks on `astro check` (warnings), ESLint, Stylelint token rules, Prettier, the Container tests, Playwright, and a changeset. Deprecations live for at least one minor with a dev warning and are removed only in a major [Practice, mirroring Official Astro policy].

---

## 10. Maintenance

**Astro upgrades** [Official]: only the current major is supported ([Upgrade Astro](https://docs.astro.build/en/upgrade-astro/#documentation-updates)). `npx @astrojs/upgrade` upgrades Astro and official integrations together ([Upgrade Astro](https://docs.astro.build/en/upgrade-astro/#_top)). Node policy: latest Maintenance LTS plus Active LTS. Maintenance-LTS minimum bumps can land in minors ([Node policy](https://docs.astro.build/en/upgrade-astro/#nodejs-support-and-upgrade-policies)). Majors come with an "Upgrade to vX" guide, and v7's includes a coding-agent prompt ([v7](https://docs.astro.build/en/guides/upgrade-to/v7/#_top)).

What past majors broke for a source-shipped component library:

| Major | DS-relevant breaks | Source |
|---|---|---|
| v6 | Node ≥ 22.12; Vite 7 / Environments API (integrations); `getViteConfig()` needs Vitest 3.2+; `Astro.glob`, `<ViewTransitions />`, CJS config removed; `<style>`/`<script>` in source order | [v6](https://docs.astro.build/en/guides/upgrade-to/v6/#dependency-upgrades) |
| v7 | Rust compiler errors on invalid HTML; `compressHTML: 'jsx'` whitespace; cosmetic CSS re-serialization; Vite 8; Container `getContainerRenderer` root import deprecated in favour of `/container-renderer` | [v7](https://docs.astro.build/en/guides/upgrade-to/v7/#rust-compiler); [v7 Deprecated](https://docs.astro.build/en/guides/upgrade-to/v7/#deprecated) |

Because consumers compile your `.astro` source, a new Astro major reaches your library when *the consumer* upgrades. Run CI against both ends of the declared peer range, and run the Container suite on every Astro minor, since that API is experimental [Practice]. Group `astro` and `@astrojs/*` in Renovate, mirroring the "upgrade together" guidance. Renovate configuration specifics are **unverified** [Practice].

**Token changes** [Practice]: semver applies to token *names*. A value change is a patch or minor, reviewed through the visual diff. A rename or removal is a major, unless the old name ships as an alias (`--ds-old: var(--ds-new)`) for one minor first. The Stylelint `value-no-unknown-custom-properties` gate catches consumers referencing removed tokens at build time.

**Figma drift** [Practice]: Enterprise teams get a webhook → PR loop, so drift becomes a visible PR. Without Enterprise, run a monthly export reconciliation, plus visual regression and the Figma "Check designs" audit (early access) on the design side ([Forum](https://forum.figma.com/product-updates-3/everything-we-covered-at-schema-by-figma-46763)). Figma import **overwrites** rather than merges, so never import into the source file from code without a backup (vendor-reported; [Atomize](https://atomize.tools/blog/figma-variables-export-json/)).

**Breaking-change policy** [Practice, aligned with Astro's Official semver policy]: majors at most twice a year. Each one ships an upgrade guide with "what changed / what to do" entries, the format Astro uses ([Semantic versioning](https://docs.astro.build/en/upgrade-astro/#semantic-versioning)). Every removal must have been preceded by a deprecation warning in a minor.

**Rule / Decision:** Upgrade to each new Astro major within one DS minor cycle, using `@astrojs/upgrade`. Treat token renames as breaking. Fold Figma drift into the PR/visual-diff loop rather than ad-hoc syncs [Practice on Official policy].

---

## 11. Bootstrap roadmap (empty repo → first released component)

1. **Decide D1–D5** (§0). Record the decisions in `docs/adr/` [Practice].
2. **Figma foundations:** Variables in primitive and semantic collections, with modes; set code syntax to `--ds-*` names (code syntax field unverified) [Practice].
3. **Scaffold:** Node ≥ 22.12 ([v6](https://docs.astro.build/en/guides/upgrade-to/v6/#dependency-upgrades)); create the workspace with `packages/tokens`, `packages/ui` and `apps/docs`. Single-site branch: `src/` folders instead (§5) [Practice]. For the docs app, `npm create astro@latest` with the Starlight template; the `--template component` starter exists for packages ([Publishing](https://docs.astro.build/en/guides/integrations/#publishing-your-integration-to-npm)) [Official].
4. **TypeScript and config:** `strictest` tsconfig and `scopedStyleStrategy: 'where'` (§6, §9) [Official options].
5. **Token pipeline:** export → `figma-export/` → `normalize` → DTCG `tokens/` → Style Dictionary or Terrazzo → `dist/tokens.css` (§4a). Verify the transformer API first, because the SD config is **unverified** [Ecosystem/Practice].
6. **Global CSS wiring:** `layers.css` + `tokens.css` imported once in the base layout, or through the integration's `injectScript('page-ssr', …)` ([injectScript](https://docs.astro.build/en/reference/integrations-reference/#injectscript-option)) [Official]. Tailwind branch: `astro add tailwind`, then map tokens with `@theme inline` [Official/unverified semantics].
7. **Quality gates:** ESLint, Prettier, Stylelint with the token rule, `astro check`, and Vitest via `getViteConfig()` (§8, §9) [Official/Ecosystem].
8. **Button:** spec table in Figma → `components/button.json` tokens → `Button.astro` → Container test (§6) [Practice].
9. **Docs + demo route:** Starlight page with demo, code, props table and do/don't, plus `/test/button` routes per mode (§6, §7) [Practice].
10. **Playwright:** `webServer` → preview, screenshot baselines generated in the pinned CI image, axe, keyboard ([Testing](https://docs.astro.build/en/guides/testing)) [Official/Ecosystem].
11. **Figma link-back:** Code Connect template (Org/Enterprise) or a docs URL in the component description (§4c) [Official Figma/Practice].
12. **CI + Changesets:** workflow from §9; first changeset; merge the "Version Packages" PR to publish `0.1.0` [Ecosystem].

**Rule / Decision:** Don't start component #2 until Button has passed every gate in CI and been released. The pipeline is the product; the first component only proves it [Practice].

---

## 12. Sources

**Astro (live v7 docs unless noted)**
- [Upgrade Astro (versions, semver, Node policy)](https://docs.astro.build/en/upgrade-astro/) · [Upgrade to v7](https://docs.astro.build/en/guides/upgrade-to/v7/) · [Upgrade to v6](https://docs.astro.build/en/guides/upgrade-to/v6/) · [Upgrade to v5](https://docs.astro.build/en/guides/upgrade-to/v5/) · [Upgrade to v3](https://docs.astro.build/en/guides/upgrade-to/v3/)
- [Project structure](https://docs.astro.build/en/basics/project-structure/) · [Components](https://docs.astro.build/en/basics/astro-components/) · [Layouts](https://docs.astro.build/en/basics/layouts/) · [Template expressions reference](https://docs.astro.build/en/reference/astro-syntax/)
- [Styling](https://docs.astro.build/en/guides/styling/) · [Directives reference](https://docs.astro.build/en/reference/directives-reference/) · [Scripts](https://docs.astro.build/en/guides/client-side-scripts/) · [Configuration reference](https://docs.astro.build/en/reference/configuration-reference/)
- [TypeScript](https://docs.astro.build/en/guides/typescript/) · [CLI reference](https://docs.astro.build/en/reference/cli-reference/#astro-check)
- [Front-end frameworks](https://docs.astro.build/en/guides/framework-components/) · [Server islands](https://docs.astro.build/en/guides/server-islands/) · [On-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/) · [Images](https://docs.astro.build/en/guides/images/)
- [Integration API](https://docs.astro.build/en/reference/integrations-reference/) · [Integrations guide / publishing](https://docs.astro.build/en/guides/integrations/#publishing-your-component) · [Dev toolbar](https://docs.astro.build/en/guides/dev-toolbar/) · [Dev Toolbar App API](https://docs.astro.build/en/reference/dev-toolbar-app-reference/)
- [Fonts](https://docs.astro.build/en/guides/fonts/) · [Content collections](https://docs.astro.build/en/guides/content-collections/) · [View transitions](https://docs.astro.build/en/guides/view-transitions/)
- [Container API (experimental)](https://docs.astro.build/en/reference/container-reference/) · [Testing](https://docs.astro.build/en/guides/testing)
- [npm: astro](https://registry.npmjs.org/astro) · [Starlight: overriding components](https://starlight.astro.build/guides/overriding-components/) · [Starlight: CSS & Tailwind](https://starlight.astro.build/guides/css-and-tailwind/) · [Starlight: using components](https://starlight.astro.build/components/using-components/) · [npm: @astrojs/starlight](https://registry.npmjs.org/@astrojs/starlight) · [prettier-plugin-astro](https://github.com/withastro/prettier-plugin-astro)

**Figma**
- [Variables REST API](https://developers.figma.com/docs/rest-api/variables) · [Webhooks events](https://developers.figma.com/docs/rest-api/webhooks-events) · [Code Connect README](https://github.com/figma/code-connect) · [Template files](https://developers.figma.com/docs/code-connect/template-files/) · [Code Connect UI](https://developers.figma.com/docs/code-connect/code-connect-ui-setup/)
- Forum: [Schema 2025 recap](https://forum.figma.com/product-updates-3/everything-we-covered-at-schema-by-figma-46763) · [Native export thread](https://forum.figma.com/ask-the-community-7/native-variable-export-feature-47831) · [DTCG composite export](https://forum.figma.com/suggest-a-feature-11/dtcg-composite-token-export-support-51314) · [Slots open beta](https://forum.figma.com/product-updates-3/slots-is-rolling-out-in-open-beta-51584)

**Tokens**
- [W3C DTCG 2025.10 announcement](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/) · [designtokens.org](https://designtokens.org/) · [Terrazzo: Import from Figma](https://terrazzo.app/docs/guides/import-from-figma) · [Tokens Studio export](https://docs.tokens.studio/figma/export/token-sets) · [Always Twisted, tokens workflow pt. 10](https://www.alwaystwisted.com/articles/a-design-tokens-workflow-part-10) · [Atomize (vendor)](https://atomize.tools/blog/figma-variables-export-json/)

**Docs and testing**
- [storybook-astro README](https://raw.githubusercontent.com/storybook-astro/storybook-astro/main/README.md) · [roadmap](https://raw.githubusercontent.com/storybook-astro/storybook-astro/main/apps/website/src/content/docs/guides/roadmap.md) · [testing guide](https://raw.githubusercontent.com/storybook-astro/storybook-astro/main/apps/website/src/content/docs/guides/testing.md) · [npm: @storybook-astro/framework](https://registry.npmjs.org/@storybook-astro/framework) · [storybookjs#18963](https://github.com/storybookjs/storybook/issues/18963)
- [Playwright visual comparisons](https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/test-snapshots-js.md) · [axe-core Playwright](https://raw.githubusercontent.com/dequelabs/axe-core-npm/develop/packages/playwright/README.md) · [Chromatic + Playwright](https://chromatic.com/blog/how-to-visual-test-ui-using-playwright) · [npm: @percy/playwright](https://registry.npmjs.org/@percy/playwright) · [npm: pa11y-ci](https://registry.npmjs.org/pa11y-ci) · [Histoire](https://raw.githubusercontent.com/histoire-dev/histoire/main/README.md)

**Governance tooling**
- [eslint-plugin-astro](https://ota-meshi.github.io/eslint-plugin-astro/user-guide/) · [Biome 2.3](https://biomejs.dev/blog/biome-v2-3/) · [stylelint-config-html](https://github.com/ota-meshi/stylelint-config-html) · [stylelint-value-no-unknown-custom-properties](https://github.com/csstools/stylelint-value-no-unknown-custom-properties/) · [changesets/action (mirror)](https://awesome.ecosyste.ms/projects/github.com%2Fchangesets%2Faction)

**Known unverified items to check before adoption:** Style Dictionary v4/v5 API and DTCG object-dimension support; Terrazzo CSS plugin options; DTCG 2025.10 resolver schema; Figma `codeSyntax` field and webhook plan gating; `@theme` vs `@theme inline` semantics; `light-dark()` Baseline status; `stylelint-declaration-strict-value`; AxeBuilder `withTags` in 4.14; `@storybook/addon-a11y` with Storybook-Astro; `astro check` severity of `@deprecated`; Renovate presets; Code Connect `language: "astro"`.

**Rule / Decision:** Cite only the live v7 docs (v6 and v5 are unmaintained snapshots). Resolve every item in the unverified list above before it enters the pipeline [Practice].
