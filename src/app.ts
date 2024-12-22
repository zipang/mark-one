/**
 * Launch the API server (Elysia)
 */
import { Elysia } from "elysia";
import { staticPlugin } from '@elysiajs/static'
import { routes } from '@api/routes';

const app = new Elysia()
    .use(routes)
    .use(staticPlugin({ assets: 'public/', prefix: '/' }))
    .listen(process.env.PORT ?? 3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
