import { basename } from "path";
import { createBlankPage, type Page, type PDFOptions } from "./browser";

/**
 * Render an HTML page to an in memory PDF File
 * @param {string} title Page title
 * @param {string} html HTML content
 * @returns {Promise<File>}
 * @see https://pptr.dev/api/puppeteer.pdfoptions
 */
export const renderPdf = async (title: string, html: string): Promise<File> => {

    let page: Page | null = null;

    try {
        page = await createBlankPage();

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

        console.log(`Rendering PDF...`);
        const buf = await page.pdf(options);

        return new File([buf], `${title}.pdf`, { type: "application/pdf" });

    } catch (error) {
        console.error(`renderPdf(${title})`, error, html);
        throw new Error("Error while generating PDF file", { cause: error });
    } finally {
        if (page) {
            page.close();
            page = null;
            console.log("Page closed");
        }
    }
};

/**
 * Convert an HTML page to a PDF file
 * @param html 
 * @param outputPath 
 * @returns {Promise<number>}
 * @see https://bun.sh/docs/api/file#write
 */
export const writePdfToFile = async (html: string, outputPath: string): Promise<number> => {
    const title = basename(outputPath, ".pdf");
    const file = await renderPdf(title, html);
    return Bun.write(outputPath, file);
}