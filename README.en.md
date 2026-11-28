# Search Visibility

[한국어 안내](README.md)

Search Visibility is a free local CLI and a collection of agent skills for technical SEO and AI search visibility. Use it to audit pages, summarize Google Search Console exports, and check whether AI answers mention your brand or cite a source you own. The CLI runs on Node.js 18 or later with no package installation or API keys.

## Run the offline demo

```sh
git clone https://github.com/shaul1991/search-visibility.git
cd search-visibility
npm run demo -- --lang en
```

Open the printed `index.html` path in a browser. The demo uses two local pages, a synthetic search performance table, and three synthetic answers. The accompanying `report.json` includes machine-readable fields such as `site.pages`, `searchPerformance`, and `ai.records`.

### Run the npm package

Run `npm pack` in the checkout and use the generated tarball path in the commands below. The second command prints the single-page audit as JSON.

```bash
npx --yes --package=./search-visibility-0.6.0.tgz search-visibility https://example.org/ --lang en
npx --yes --package=./search-visibility-0.6.0.tgz seo-check https://example.org/ --json
```

After publication to the npm registry, you can use `search-visibility` as the value of `--package`.

## Audit a site

Run a one-page audit from the repository directory. Replace the example URL with the page you want indexed.

```sh
npm run visibility -- https://example.org/ --lang en
```

You can also pass the address as `--url https://example.org/`. To create a reusable starter, run the following commands and edit the example URL before the second command.

```sh
npm run visibility -- init --lang en
npm run visibility -- ./visibility.config.json
```

`init` accepts an optional file path inside an existing directory and preserves existing files. The starter records the selected report language.

You can also supply local HTML paths in `targets` or a sitemap URL in `sitemap`. Input paths resolve relative to the config file. Remote audits request the specified sites. Reports are written locally under `visibility-reports/`.

When `sitemap` is omitted, the audit follows same-origin `Sitemap:` declarations found in the final target pages’ `robots.txt`. An explicit sitemap takes precedence. The audit runs up to four pages at a time and keeps the input and discovery order in the report. For multilingual pages, it checks HTML `hreflang` declarations for `x-default` and verifies return links between successfully audited URLs. The page report summarizes robots rules by AI crawler and purpose. These decisions describe the published rules for the final URL.

Set top-level `"locale": "en"` in the config to keep English as the report language. `--lang en|ko` overrides the config. Korean is the default. Reports preserve original page text, CSV labels, and observed questions. For help in English, run `npm run visibility -- --help --lang en`. The standalone checker also accepts `--lang`.

Use the [localized page audit guide](docs/localized-pages.en.md) to check canonical and indexability signals for language and regional variants.

## Measure search and AI visibility

- **Google search.** Set `searchConsole` to the path of a UTF-8 CSV exported from a property you can access. Import one query, page, or date table with English, Korean, Japanese, German, French, or Spanish headers for the dimension, clicks, and impressions. The report calculates CTR from the imported rows. [Import a localized CSV](docs/search-console.en.md).
- **AI answers.** Set `brand` to your brand name, then add the answers you collected to `observations` as an array or a path to a JSON file. Each record needs `engine`, `query`, `observedAt`, `answer`, and `sources`. Use an empty list for an observed answer with no cited links. Include the observation language in `locale` when comparing markets. The CLI analyzes the supplied sample locally. [Example records](examples/demo/answers.json)
- **Citation ownership.** Put hosts you own in `domains` to include their subdomains. For an account on a shared host, put its full HTTP(S) account URL in `ownedUrlPrefixes`. A citation counts if either rule matches. For example, `https://github.com/example-team` covers that account and its repositories. A sibling account such as `example-team-tools` is outside that scope. For a single GitHub account, use only the account prefix. Adding `github.com` to `domains` would include every account. Prefixes require a path on the same origin (scheme, host, and port). Omit credentials, query strings, and fragments.

The offline HTML report shows counts by severity, lets you filter checks and sort pages by priority, and suggests fixes for common technical issues. Copy the overview to share it, or print and save to PDF with collapsed findings and evidence included.

Run `npm run visibility -- compare <before/report.json> <after/report.json> --lang en` to generate an HTML and JSON comparison of site findings, Search Console performance, and AI visibility by engine.

Use the [before-and-after AI citation guide](docs/ai-comparison.en.md) to compare the same questions and markets with a runnable synthetic example.

For Korean search, use the [Naver, Daum and AI Briefing measurement guide](docs/korea-search.en.md).

Use the [ChatGPT Search visibility guide](docs/chatgpt-search.en.md) to measure citations and website referrals.

Use the [Perplexity Search citation guide](docs/perplexity-search.en.md) to record search settings and count citations to an owned account.

Use the [Gemini web app source guide](docs/gemini-app.en.md) to collect public links and measure visibility by language and country.

Use the [Google AI visibility guide](docs/google-ai.en.md) to interpret Search Console AI impressions and sampled citations.

Use the [Bing and Copilot citation guide](docs/bing-ai.en.md) to compare Bing Webmaster Tools metrics and locally collected answers.

## Install skills

To install the audit and citation skills for Claude Code and Codex, run this in the project where you use the agent.

```sh
npx skills add shaul1991/search-visibility -s seo-orchestrator ai-observations -a claude-code -a codex
```

### Run the CLI from a single installed skill

From your project root, install just `seo-orchestrator` with the [skills CLI](https://github.com/vercel-labs/skills).

```sh
npx skills add shaul1991/search-visibility -s seo-orchestrator -a claude-code -a codex -y
```

Save this synthetic sample as `visibility.config.json` in your project root. Then run the installed script with Node.js 18 or later.

```json
{
  "brand": "Example Studio",
  "sample": true,
  "domains": ["bücher.example"],
  "observations": [
    {
      "engine": "Synthetic",
      "query": "어떤 서점이 있나요?",
      "locale": "ko-KR",
      "observedAt": "2026-01-15T12:00:00+09:00",
      "answer": "Example Studio를 살펴보세요.",
      "sources": ["https://xn--bcher-kva.example/books"]
    }
  ]
}
```

```sh
node .agents/skills/seo-orchestrator/scripts/visibility.mjs ./visibility.config.json
```

The report shows one owned citation in one observed answer. The Unicode domain in `domains` matches the Punycode host in `sources`. The Korean question and explicit UTC offset are sample inputs. This command analyzes the supplied answer locally without contacting a search engine or AI platform. In a manual Claude Code installation, use the script under `.claude/skills/seo-orchestrator/`.

## Contribute

Regional search guidance, translated examples, and reproducible parser cases are welcome. For a locale-specific CSV issue, include synthetic headers and a representative row. Run `npm test` from the repository root when changing code. CI checks skill metadata, the orchestrator catalog, documented CLI paths and options, and version alignment across the Claude plugin, marketplace, and npm package. [Skill catalog](README.md#구성) · [License](LICENSE)
