import { renderHtmlPage } from "@services/render-html";
import { renderPdf } from "@services/pdf-renderer";
import { type Context } from "elysia";
import { basename, extname } from "path";
import { marked } from "marked";

/**
 * Receive a Markdown body and render it as HTML of PDF
 * @param {Context} ctx HTTP request context
 * @returns {Promise<Response>}
 */
export const renderMarkdownFile = async (ctx: Context) => {
    const markdown = await ctx.body as string;
    const title = basename(ctx.params.filename);
    const ext = extname(ctx.params.filename).toLowerCase();

    // We always start with HTML
    let content = await marked(markdown);
    content = await renderHtmlPage({ title, content });

    switch (ext) {
        case '.htm':
        case '.html':
            return new Response(content, { headers: { 'Content-Type': 'text/html' } });

        case '.pdf':
            return renderPdf(title, content);

        default:
            return new Response(`Unsupported conversion of markdown document '${title}' to ${ext} format`, { status: 400 });
    }
}
