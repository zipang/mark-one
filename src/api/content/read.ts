import { renderMarkdownBody } from "@api/markdown/render/file";
import { type Context } from "elysia/context";
import { contentDir } from "locations";
import { basename, dirname, extname, resolve } from "path";

/**
 * Receive the path of the Markdown file to retrieve or render as HTML of PDF
 * @param {Context} ctx HTTP request context
 * @returns {Promise<Response>}
 */
export const readFile = async (ctx: Context) => {
    let path = ctx.params['*'];
    const ext = extname(path) || '.md';
    const filename = basename(path, ext);
    path = dirname(path);

    const markdownFile = Bun.file(resolve(contentDir, path, `${filename}.md`))
    console.log("readFile", markdownFile.name);

    try {
        if (ext === '.md') {
            // ElysiaJS knows how to return the content of a BunFile
            return markdownFile;
        }
    
        ctx.body = await markdownFile.text();
        ctx.params.filename = filename + ext;
    
        return renderMarkdownBody(ctx)

    } catch (error) {
        // It's faster to catch the error when the file doesn't exist
        return new Response(`${error}`, { status: 404 });
    }

}
