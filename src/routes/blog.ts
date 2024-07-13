import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();

blogRouter.use("/*", async (c, next) => {
    const jwt = c.req.header("Authorization") || "";
    if (!jwt) {
        c.status(403);
        return c.json({ error: "unauthorized" });
    }

    const token = jwt.split("")[1];
    const payload = await verify(token, c.env?.JWT_SECRET);
    if (!payload) {
        c.status(403);
        return c.json({ error: "unauthorized" });
    }
    await next();
})



blogRouter.put('/', (c) => {
    return c.text('Hello Hono!')
})

blogRouter.get('/', (c) => {
    return c.text('Hello Hono!')
})

blogRouter.get('/bulk', (c) => {
    return c.text('Hello Hono!')
})