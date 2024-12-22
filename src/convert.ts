import { marked } from "marked";
import { readdir } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { renderHtmlPage } from "@services/render-html";
import { writePdfToFile } from "@services/pdf-renderer";
import { disposeBrowser } from "@services/browser";
import { inputDir, outputDir } from "../locations";

/**
 * Read all the markdown files found in the input/ folder,
 * and generate a HTML file for each of them in the output/ folder
 */
const convertMarkdownFiles = async () => {
	const start = Date.now();

	console.log("Loading markdown files from ", inputDir);
	const markdownFiles = await readdir(inputDir, { recursive: true });

	const conversionJobs = markdownFiles.map(async (markdownFile) => {
		const inputFile = Bun.file(resolve(inputDir, markdownFile));
		const title = basename(markdownFile, ".md");
		console.log(`Reading ${title}`);

		const htmlFile = resolve(outputDir, `${title}.html`);
		const pdfFile = resolve(outputDir, `${title}.pdf`);

		// First convert the markdown to HTML
		const markdown = await inputFile.text();
		const content = await marked(markdown);

		return Promise.all([
			Bun.write(htmlFile, renderHtmlPage({ title, content })),
			writePdfToFile(content, pdfFile),
		]);
	});

	await Promise.all(conversionJobs).then(() => disposeBrowser());

	const elapsed = Date.now() - start;
	console.log(`Conversion completed in ${elapsed}ms!`);
};

try {
	await convertMarkdownFiles();
	process.exit(0);
} catch (error) {
	console.error(error);
	process.exit(-1);
} 
