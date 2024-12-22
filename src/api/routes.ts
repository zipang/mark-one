import { Elysia } from 'elysia'
import { renderMarkdownFile } from '@api/markdown/render/file'
import { readFile } from '@api/content/read'

export const routes = new Elysia()
    .get('/content/*', readFile)
    .post('/api/markdown/render/:filename', renderMarkdownFile)
