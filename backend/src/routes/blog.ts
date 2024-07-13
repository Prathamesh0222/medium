import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInput, updateBlogInput } from "@prathamesh0222/medium-common";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        userId: string
    }
}>();

blogRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header("Authorization") || "";
    if (!authHeader) {
        c.status(403);
        return c.json({ error: "unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const payload = await verify(token, c.env?.JWT_SECRET);
    if (!payload) {
        c.status(403);
        return c.json({ error: "unauthorized" });
    }
    c.set('userId', payload.id as string);
    await next();
})

blogRouter.post('/', async (c) => {
    const client = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
        const body = await c.req.json();
        const { success } = createBlogInput.safeParse(body);
        if (!success) {
            c.status(403);
            return c.json({ message: "invalid input" });
        }
        const authorId = c.get("userId");
        const blog = await client.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: authorId
            }
        })
        return c.json({
            id: blog.id
        })
    } catch (e) {
        console.log(e);
    }

})

blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const client = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const { success } = updateBlogInput.safeParse(body);
    if (!success) {
        c.status(403);
        return c.json({ message: "invalid input" });
    }

    const blog = await client.post.update({
        where: {
            id: body.id,
        },
        data: {
            title: body.title,
            content: body.content
        }
    }

    )

    return c.json({
        id: blog
    })
})

blogRouter.get("/bulk", async (c) => {
    const client = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const blogs = await client.post.findMany();

    return c.json({
        blogs
    })
})

blogRouter.get('/:id', async (c) => {
    const param = await c.req.param("id");
    const client = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blog = await client.post.findFirst({
            where: {
                id: param
            }
        })

        return c.json({
            blog
        })
    } catch (e) {
        console.log(e);
        c.status(401);
        return c.json({
            message: "Error while fetching blog post"
        })
    }
})
