# Search Visibility

[한국어](README.md)

Audit your website for search and AI visibility. Review technical findings, Google Search performance, and brand mentions and citations from your own AI observations in local HTML and JSON reports.

## Quickstart

Requires Node.js 18 or later. This command fetches the CLI from the public GitHub repository. Replace the example URL with the page you want to audit.

```sh
npx --yes --package=github:shaul1991/search-visibility search-visibility https://example.org/ --lang en
```

Open `index.html` from the printed output directory and review the highest-priority FAIL and WARN findings. For repeatable runs, create a starter in a fresh working directory and edit `targets`.

```sh
npx --yes --package=github:shaul1991/search-visibility search-visibility init --lang en
```

```sh
npx --yes --package=github:shaul1991/search-visibility search-visibility ./visibility.config.json --out before --lang en
```

Deploy your changes, repeat the measurement under the same conditions, and compare the results. Use new directories for `--out`.

```sh
npx --yes --package=github:shaul1991/search-visibility search-visibility ./visibility.config.json --out after --lang en
npx --yes --package=github:shaul1991/search-visibility search-visibility compare before/report.json after/report.json --out comparison --lang en
```

For a single-page technical audit in JSON, run the following command. Use `--expect-indexable` on pages intended for indexing. A FAIL produces exit code 1.

```sh
npx --yes --package=github:shaul1991/search-visibility seo-check https://example.org/ --expect-indexable --json --lang en
```

To see the output without auditing your site, download and open the [sample HTML report with synthetic data](https://github.com/shaul1991/search-visibility/releases/download/v0.5.0/search-visibility-demo.html).

## Features

| Feature | What you can check |
| --- | --- |
| Technical audit | HTTP redirects, robots.txt, indexing directives, canonicals, sitemaps, hreflang, sharing tags, and JSON-LD |
| AI crawler rules | robots.txt directives for search, training, and user-triggered requests on the final URL |
| Google Search performance | Clicks, impressions, and CTR from Search Console CSV exports |
| AI answer observations | Brand mentions and citations to owned domains or owned profiles on shared platforms, grouped by engine |
| Comparison reports | Changes in technical findings, Search performance, AI mention rates, and citation rates |

## Measurement Toolbox

Find the affected URL and evidence in the report, then verify the public URL with the tools below. Save the results and repeat the check after deployment.

### Official search consoles, crawling, and submission

| Official tool | What to do after the audit |
| --- | --- |
| [Google Search Console](https://search.google.com/search-console/about) | Use URL Inspection to check indexing and Google's selected canonical. Set the date range and filters in Performance and export CSV. |
| [Naver Search Advisor](https://searchadvisor.naver.com/) | Check page optimization with the quick site check. Verify ownership before requesting a crawl in Webmaster Tools. |
| [Daum Search Registration](https://register.search.daum.net/index.daum) | Register a site or blog and look up its registration status. |
| [Bing Webmaster Tools](https://www.bing.com/webmasters/about) | Verify ownership, then inspect URLs and submit sitemaps. |
| [IndexNow](https://www.indexnow.org/) | Notify participating engines of added, updated, or deleted URLs. Check index status with each engine after submission. |

### Structured data, sharing previews, and performance

| Official tool | What to do after the audit |
| --- | --- |
| [Google Rich Results Test](https://search.google.com/test/rich-results) | Check which Google rich result types are eligible and identify missing or invalid required properties. |
| [Schema Markup Validator](https://validator.schema.org/) | Validate Schema.org types and properties. |
| [Meta Sharing Debugger](https://developers.facebook.com/tools/debug/) | Inspect the link preview and scrape details, then use Scrape Again after an update. |
| [Kakao Sharing Debugger](https://developers.kakao.com/tool/debugger/sharing) | Sign in to Kakao, review the sharing preview, and clear the cache after changing Open Graph tags. |
| [PageSpeed Insights](https://pagespeed.web.dev/) / [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) | Use PSI for lab metrics and any available field data on public URLs. Use Lighthouse in Chrome DevTools for local URLs. |

### Measure citations in AI answers

1. Run `search-visibility init` as shown in Quickstart and fill in `targets`, `brand`, and `domains`. Set `ownedUrlPrefixes` to count citations to your own profiles on shared platforms.
2. Run your queries in ChatGPT Search, Perplexity, Google AI Overviews or AI Mode, Naver AI Briefing, and Gemini. Record each engine, query, locale, timestamp, answer, and source URLs in `observations` or a JSON file relative to the config. Keep the search mode and region with your notes so you can repeat the same conditions.
3. To include Google Search performance, point `searchConsole` to the exported CSV. Run `search-visibility` to generate a baseline. Review the sample size, brand mention rate, and owned-source citation rate by engine.
4. After deployment, repeat the same queries with the same engines, modes, regions, and languages. Use matching CSV filters and date-range lengths. Generate a new report and run `search-visibility compare`. Read the changes alongside sample sizes because answer variation can have several causes.

## Platform and workflow guides

| Topic | Guide |
| --- | --- |
| CLI setup and real data | [한국어](docs/workbench.ko.md) |
| Import Search Console CSV | [한국어](docs/search-console.ko.md) · [English](docs/search-console.en.md) |
| Localized URLs, canonical, and hreflang | [한국어](docs/localized-pages.ko.md) · [English](docs/localized-pages.en.md) |
| Naver and Daum Search, plus Naver AI Briefing | [한국어](docs/korea-search.ko.md) · [English](docs/korea-search.en.md) |
| ChatGPT Search citations and referrals | [한국어](docs/chatgpt-search.ko.md) · [English](docs/chatgpt-search.en.md) |
| Perplexity observations by search mode | [한국어](docs/perplexity-search.ko.md) · [English](docs/perplexity-search.en.md) |
| Google AI Overviews and AI Mode | [한국어](docs/google-ai.ko.md) · [English](docs/google-ai.en.md) |
| Gemini web app source observations | [한국어](docs/gemini-app.ko.md) · [English](docs/gemini-app.en.md) |
| Bing and Copilot citations and console metrics | [한국어](docs/bing-ai.ko.md) · [English](docs/bing-ai.en.md) |
| AI observation conditions and before-and-after comparison | [한국어](docs/ai-comparison.ko.md) · [English](docs/ai-comparison.en.md) |
| Open-source project comparison | [한국어](docs/landscape.ko.md) |

## Install individual Agent Skills

The project supports the [Agent Skills](https://agentskills.io) format. This command installs just `seo-orchestrator` for Claude Code and Codex. Replace or add names after `-s` to select other skills.

```sh
npx skills add shaul1991/search-visibility -s seo-orchestrator -a claude-code -a codex -y
node .agents/skills/seo-orchestrator/scripts/visibility.mjs https://example.org/ --lang en
```

For a manual install, copy the entire skill folder into `.agents/skills/` (Codex) or `.claude/skills/` (Claude Code). Start with `seo-orchestrator` when auditing multiple channels.

| Skill | Scope |
| --- | --- |
| [`seo-orchestrator`](skills/seo-orchestrator/SKILL.md) | Coordinates audits across channels and includes the CLI. |
| [`google-search`](skills/google-search/SKILL.md) | Crawling, JavaScript, canonical URLs, sitemaps, snippets, and Search Console. |
| [`naver-search`](skills/naver-search/SKILL.md) | Search Advisor, site verification, Yeti, sitemaps, and snippets. |
| [`daum-search`](skills/daum-search/SKILL.md) | Daum Search Registration, webmaster tools, and previews. |
| [`other-search-engines`](skills/other-search-engines/SKILL.md) | Bing, Brave Search, DuckDuckGo, and Apple search. |
| [`ai-crawlers`](skills/ai-crawlers/SKILL.md) | Crawler access and directives for AI search and training. |
| [`ai-observations`](skills/ai-observations/SKILL.md) | Brand mentions and citations to owned sites and profiles. |
| [`structured-data`](skills/structured-data/SKILL.md) | JSON-LD examples and platform support. |
| [`social-preview`](skills/social-preview/SKILL.md) | Open Graph, X cards, KakaoTalk, and Meta previews. |
| [`indexnow`](skills/indexnow/SKILL.md) | Changed-URL notifications for participating engines. |
| [`scaled-pages`](skills/scaled-pages/SKILL.md) | Indexing and canonical rules for large sets of generated pages. |
| [`browser-compat`](skills/browser-compat/SKILL.md) | Brave Shields, favicons, manifests, and analytics behavior. |

You can also install the complete set as a Claude Code plugin.

```text
/plugin marketplace add shaul1991/search-visibility
/plugin install seo-skills@seo-skills
```

## FAQ

**Does a crawlable page automatically get indexed?**

The audit interprets responses and crawler directives at the time of the check. Use each engine's console for its index status and selected canonical. Submissions and valid markup can help discovery or eligibility, while actual appearance depends on the platform.

**Does the CLI collect AI answers or search performance automatically?**

The CLI summarizes performance exports and answer observations you provide. The CLI itself needs no external dependencies or API keys. Official console features that require ownership use your account on that service.

**How many pages does it check, and how do I switch languages?**

The CLI audits up to 25 pages by default, with up to four concurrent checks. It uses the configured sitemap when supplied, or discovers same-origin sitemaps from the final URL's robots.txt. Korean is the default, and `--lang en|ko` overrides the config's `locale`.

**Can I audit local pages?**

The CLI accepts local HTTP URLs. Use an accessible deployed URL for tools that need to fetch it from the web.

## Sources and license

[Official sources and references](REFERENCES.md) · [MIT license](LICENSE). Search Visibility is an independent open-source project. Check the latest official documentation when applying platform policies.
