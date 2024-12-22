import { chromium, type Browser, type Page } from "playwright-chromium";

let browser: Browser | null = null;

export const getBrowser = async (): Promise<Browser> => {
    if (browser) {
        return browser;
    }
    return browser = await chromium.launch({
        headless: true,
        devtools: false,
        args: [
            '--disable-prompt-on-repost',
            '--disable-renderer-backgrounding',
            '--disable-setuid-sandbox',
            '--disable-site-isolation-trials',
            '--disable-speech-api',
            '--disable-sync',
            '--enable-gpu',
            '--headless=new',
            '--hide-scrollbars',
            '--ignore-gpu-blacklist',
            '--js-flags=--random-seed=1157259157',
            '--metrics-recording-only',
            '--mute-audio',
            '--no-default-browser-check',
            '--no-first-run',
            '--no-pings',
            '--no-sandbox',
            '--no-zygote',
            '--password-store=basic',
            '--use-gl=swiftshader',
            '--use-mock-keychain',
        ]
    });
}

export const disposeBrowser = async () => {
    if (browser) {
        await browser.close();
        browser = null;
    }
}

export const createBlankPage = async (): Promise<Page> => {
    const browser = await getBrowser();
    // Create a new incognito browser context
    const context = await browser.newContext();
    // Create a new page inside context.
    const page = await context.newPage();
    return page;
}

export type PDFOptions = {
    /**
     * Display header and footer. Defaults to `false`.
     */
    displayHeaderFooter?: boolean;

    /**
     * HTML template for the print footer. Should use the same format as the
     * [`headerTemplate`](https://playwright.dev/docs/api/class-page#page-pdf-option-header-template).
     */
    footerTemplate?: string;

    /**
     * Paper format. If set, takes priority over
     * [`width`](https://playwright.dev/docs/api/class-page#page-pdf-option-width) or
     * [`height`](https://playwright.dev/docs/api/class-page#page-pdf-option-height) options. Defaults to 'Letter'.
     */
    format?: string;

    /**
     * HTML template for the print header. Should be valid HTML markup with following classes used to inject printing
     * values into them:
     * - `'date'` formatted print date
     * - `'title'` document title
     * - `'url'` document location
     * - `'pageNumber'` current page number
     * - `'totalPages'` total pages in the document
     */
    headerTemplate?: string;

    /**
     * Paper height, accepts values labeled with units.
     */
    height?: string | number;

    /**
     * Paper orientation. Defaults to `false`.
     */
    landscape?: boolean;

    /**
     * Paper margins, defaults to none.
     */
    margin?: {
        /**
         * Top margin, accepts values labeled with units. Defaults to `0`.
         */
        top?: string | number;

        /**
         * Right margin, accepts values labeled with units. Defaults to `0`.
         */
        right?: string | number;

        /**
         * Bottom margin, accepts values labeled with units. Defaults to `0`.
         */
        bottom?: string | number;

        /**
         * Left margin, accepts values labeled with units. Defaults to `0`.
         */
        left?: string | number;
    };

    /**
     * Whether or not to embed the document outline into the PDF. Defaults to `false`.
     */
    outline?: boolean;

    /**
     * Paper ranges to print, e.g., '1-5, 8, 11-13'. Defaults to the empty string, which means print all pages.
     */
    pageRanges?: string;

    /**
     * The file path to save the PDF to. If [`path`](https://playwright.dev/docs/api/class-page#page-pdf-option-path) is a
     * relative path, then it is resolved relative to the current working directory. If no path is provided, the PDF won't
     * be saved to the disk.
     */
    path?: string;

    /**
     * Give any CSS `@page` size declared in the page priority over what is declared in
     * [`width`](https://playwright.dev/docs/api/class-page#page-pdf-option-width) and
     * [`height`](https://playwright.dev/docs/api/class-page#page-pdf-option-height) or
     * [`format`](https://playwright.dev/docs/api/class-page#page-pdf-option-format) options. Defaults to `false`, which
     * will scale the content to fit the paper size.
     */
    preferCSSPageSize?: boolean;

    /**
     * Print background graphics. Defaults to `false`.
     */
    printBackground?: boolean;

    /**
     * Scale of the webpage rendering. Defaults to `1`. Scale amount must be between 0.1 and 2.
     */
    scale?: number;

    /**
     * Whether or not to generate tagged (accessible) PDF. Defaults to `false`.
     */
    tagged?: boolean;

    /**
     * Paper width, accepts values labeled with units.
     */
    width?: string | number;
};

export { type Page };
