# AGENTS instructions for `axe`

This repository contains a small static web page.

## Directory overview
- `index.html` — main HTML file
- `axe.png` — used in the page

No tests or build steps are defined.

## Agent workflow
1. **Check HTML**. Run `tidy -e index.html`. If tidy is not installed, attempt `apt-get update && apt-get install -y tidy`. If installation fails, continue without tidy.
2. **Testing**. There are no programmatic tests. Reporting tidy output is sufficient.
3. **Commit messages**. Provide concise commit message summarizing changes. Use the imperative mood (e.g., "Add new section").
4. **Pull Request message**. Include a summary of modifications and mention tidy results.

