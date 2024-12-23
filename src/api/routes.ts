import { Elysia } from 'elysia'
import { readFile } from '@api/content/read'
import { renderMarkdownBody } from '@api/markdown/render/file'

export const routes = new Elysia()
    .get('/content/*', readFile)
    .post('/api/markdown/render/:filename', renderMarkdownBody)
