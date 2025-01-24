import type { FastifyInstance } from "fastify";
import * as userController from "./controller.user";
import { loginFSchema } from "./schemas/login.schema";
import { signUpFSchema } from "./schemas/sign-up.schema";

export const userRouter = async (app: FastifyInstance) => {
    app.post("/sign-up", { schema: signUpFSchema, config: { isPublic: true } }, userController.create);
    app.post("/login", { schema: loginFSchema, config: { isPublic: true } }, userController.login);
    app.get("/me", {}, userController.me);
};

export async function userRouters(app: FastifyInstance) {
    app.post(
        "/sign-up",
        {
            schema: {
                summary: "Sign up a new user",
                tags: ["User"],
                body: {
                    type: "object",
                    required: ["login", "password", "email"],
                    properties: {
                        login: { type: "string", maxLength: 127 },
                        password: { type: "string" },
                        email: { type: "string", format: "email" }
                    }
                },
                response: {
                    201: {
                        description: "User successfully created",
                        type: "object",
                        properties: {
                            message: { type: "string" },
                            userId: { type: "string", format: "uuid" }
                        }
                    }
                }
            }
        },
        async (_req, reply) => {
            reply.status(201).send({ message: "user created", userId: "uuid" });
        }
    );
}
