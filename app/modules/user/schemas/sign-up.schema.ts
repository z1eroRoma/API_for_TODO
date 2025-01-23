import type { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    login: z.string().min(3).max(127),
    name: z.string().min(1).max(127).optional(),
    email: z.string().email(),
    password: z.string().min(6)
});

export type signUpSchema = z.infer<typeof schema>;
export const signUpFSchema: FastifySchema = { body: schema };
