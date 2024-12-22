# Mark One

Create HTML and PDF files from markdown files.

## Technical stack

This project relies on these _awesome_ modern technologies:

* [bun](https://bun.sh) as the runtime / package manager / test runner / bundler
* [ElysiaJS](https://elysiajs.com/) for the fastest API and web server out there 🦊
* [Playwright](https://playwright.dev/) for the PDF generation (still some tests to write to see if it is really better than [Puppeteer](https://pptr.dev/) for that sole purpose)
* [marked](https://marked.js.org/) for the markdown parsing and rendering

## Installation

To install dependencies:

```bash
bun install
```

To launch the unit tests:

```bash
bun test
```

To launch the app and API server in dev mode:

```bash
bun dev
```

