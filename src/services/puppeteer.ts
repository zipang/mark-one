import puppeteer, {
    Browser,
    Page,
    type Viewport,
} from 'puppeteer'

export const DEFAULT_VIEWPORT = { width: 1280, height: 900 } as Viewport

export type LogFn = (message?: any, ...optionalParams: any[]) => void

// This minimal interface allows us to inject the console in place of a FastifyBaseLogger during the tests
export interface Logger {
    error: LogFn
    warn: LogFn
    info: LogFn
    debug: LogFn
}

export interface StringValues {
    [key: string]: string
}

/**
 * On these options used to speed up the headless Chrome:
 * @see https://jtway.co/optimize-your-chrome-options-for-testing-to-get-x1-25-impact-4f19f071bf45
 * @see https://github.com/GoogleChrome/chrome-launcher/blob/main/docs/chrome-flags-for-tools.md
 */
export const OPTIMIZED_CHROME_FLAGS = [
    '--font-render-hinting=none',
    '--force-color-profile=srgb',
    '--enable-automation',
    '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-checker-imaging',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-datasaver-prompt',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess,BlinkGenPropertyTrees,IsolateOrigins,TranslateUI',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-infobars',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-site-isolation-trials',
    '--disable-speech-api',
    '--disable-sync',
    '--enable-gpu',
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


type BrowserInitState =
    | { state: 'empty' }
    | { state: 'pending' }
    | { state: 'ready'; instance: Browser }
const EMPTY_STATE = { state: 'empty' } as const
const PENDING_STATE = { state: 'pending' } as const
let browerInitState: BrowserInitState = EMPTY_STATE

/**
 * Retrieves always the same unique instance of a Chrome headless Browser
 */
export const getBrowser: (options?: Record<string, string>) => Promise<Browser> = async (
    options = {}
) => {
    const { state } = browerInitState
    switch (state) {
        case 'ready':
            return browerInitState.instance

        case 'empty':
            browerInitState = PENDING_STATE
            const instance = await puppeteer.launch({
                headless: false,
                devtools: false,
                args: OPTIMIZED_CHROME_FLAGS,
                ...options,
            })
            browerInitState = { state: 'ready', instance }
            console.log(`Single instance of Chrome browser started`)
            return instance

        case 'pending':
            // We have a concurrent access for the first time
            return new Promise((resolvePromise, reject) => {
                // Prepare to wait for 20s before we issue a timeout
                const cancelWait = () => {
                    const errorMsg = `getBrowser() timed out. We could be in an unhealthy state.`
                    browerInitState = EMPTY_STATE
                    reject(new Error(errorMsg))
                }
                const timeoutId = setTimeout(cancelWait, 20000)
                const waitForBro = () => {
                    if (browerInitState.state === 'ready') {
                        clearTimeout(timeoutId)
                        resolvePromise(browerInitState.instance)
                    } else {
                        setTimeout(waitForBro, 1000)
                    }
                }
                waitForBro()
            })
    }
}

/**
 * Close the Chrome instance and all its opened pages (tabs)
 */
export const disposeBrowser = async (
    msg = `Disposing of Chrome browser instance`,
    logger?: Logger
) => {
    if (browerInitState === EMPTY_STATE) {
        // Nothing to do
        return
    }

    logger?.info(msg)
    let browser

    try {
        browser = await getBrowser()
    } catch (err) {
        // We may land here if getBrowser() times out
        // We have no browser to close
        logger?.debug(`disposeBrowser(): ${(err as Error).message}`)
    } finally {
        browerInitState = EMPTY_STATE
        return browser?.close()
    }
}

type PAGE_OPTIONS = {
    log?: (msg: string) => void
    timeout?: number
}

/**
 * Open a new blank page (tab) inside the current browser
 * Used by the Health Check and `loadPage()`
 * Use `loadPage()` instead to get an instrumented page
 * with all the loggin of the inner requests
 */
export const createBlankPage = async (opts: PAGE_OPTIONS = {}) => {
    const { log = console.debug, timeout = 10000 } = opts
    return new Promise((resolvePromise: (page: Page) => void, reject: (err: Error) => void) => {
        const timeoutId = setTimeout(
            () => reject(new Error(`Failed to create new page in ${timeout}ms`)),
            timeout
        )

        // Retrieve the browser instance
        log(`=> Retrieving Chrome instance`)
        getBrowser()
            .then((browser) => {
                // Create a new page inside a new context isolated from every other pages
                log(`=> Creating new page`)
                return browser.createBrowserContext()
            })
            .then((context) => context.newPage())
            .then(resolvePromise)
            .finally(() => clearTimeout(timeoutId))
    }).catch((error) => {
        // That's bad. Hopefully we'll get back to normal by creating a brand new Browser instance
        disposeBrowser(
            `${error.message}. We'll have to dispose of the current Browser instance to get it back.`
        )
        // Let the calling process decide it's own retry strategy
        throw error
    })
}

/**
 * Close the page and all its children potentially opened with `window.open()`
 */
export const disposePage: (page?: Page | null, logger?: Logger) => Promise<void> = async (
    page,
    logger
) => {
    if (!page) {
        logger?.warn(`disposePage() called with no page instance`)
        return
    }

    try {
        const location = await getPageLocation(page)
        logger?.info(`Closing page '${location}'`)
        await page.browserContext().close()
    } catch (err) {
        logger?.warn(`Error while closing page: ${(err as Error).message}`)
    }
}

export const disposePages = async (pages: Page[], logger?: Logger) => {
    await Promise.all(pages.map((page) => disposePage(page, logger)))
}


export const getPageLocation = async (page: Page) => {
    const evalLocation = () => window.location.toString()
    return page.evaluate(evalLocation)
}

