import { Browser, Page, type PDFOptions } from "puppeteer";
import { createBlankPage } from "./puppeteer";

/**
 * Use Puppeteer to render a PDF from a HTML page
 */
export const renderPdf = async (html: string): Promise<Uint8Array> => {

    try {
        const page = await createBlankPage();

        console.log("Setting page HTML content");
        await page.setContent(html);

        const options: PDFOptions = {
            printBackground: true,
            preferCSSPageSize: true,
            format: "A4",
            margin: {
                top: "1cm",
                bottom: "1cm",
                left: "1cm",
                right: "1cm"
            }
        };

        return page.pdf(options);

    } catch (error) {
        console.error(error);
        throw new Error("Error while rendering PDF", { cause: error });
    }

};
