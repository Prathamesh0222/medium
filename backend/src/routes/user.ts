import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signupInput, signinInput } from "@prathamesh0222/medium-common";
export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();


userRouter.post('/signup', async (c) => {
    const client = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const {success} = signupInput.safeParse(body);
    if(!success){
        c.status(403);
        return c.json({message:"invalid input"});
    }
    try {
        const user = await client.user.create({
            data: {
                username: body.username,
                password: body.password,
                firstName: body.firstName,
                lastName: body.lastName
            }
        })

        if (!user) {
            c.status(403);
            return c.json({ error: "user already exists" });
        }
        const jwt = await sign({ id: user.id }, c.env?.JWT_SECRET);
        return c.json({ jwt });
    } catch (e) {
        console.log(e);
        c.status(403);
        return c.json({ error: "error while signing up" })

    }

})

userRouter.get('/signin', async (c) => {
    const client = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const {success} = signinInput.safeParse(body);
    if(!success){
        c.status(403);
        return c.json({message:"invalid input"});
    }
    const user = await client.user.findUnique({
        where: {
            username: body.username
        }
    });
    if (!user) {
        c.status(403);
        return c.json({ error: "user not found" });
    }

    const jwt = await sign({ id: user.id }, c.env?.JWT_SECRET);
    return c.json({ jwt });
})