import journal from "@public/journal.css" with { type: "text" };
import revisions from "@public/revisions.css" with { type: "text" };

const styles = {
	journal,
	revisions,
};

/**
 * Name of a CSS theme to use for the page
 */
export type Theme = keyof typeof styles;

/**
 * PagesInfos type
 */
export type PageInfos = {
	title: string;
	/**
	 * The body HTML content to render inside the page
	 */
	content: string;
	theme?: Theme;
	lang?: string;
};

/**
 * Super straightformard HTML template to render some article content
 * @param {PageInfos}
 * @returns {string} the rendered HTML page
 */
export const renderHtmlPage = ({ title, content, theme = "journal", lang = "en" }: PageInfos) => `
<!DOCTYPE html>
<html lang="${lang}">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${title}</title>
	<style>
${styles[theme]}
	</style>
</head>

<body>
	<article class="container">
${content}        
	</article>
</body>

</html>
`;
