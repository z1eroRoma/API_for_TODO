import type { FastifyInstance } from "fastify";
import { objectiveRouter } from "./objectives/router.objective";
import { userRouter } from "./user/router.user";

interface IProvider {
    instance: (app: FastifyInstance) => Promise<void>;
    prefix: string;
}

export const HttpProvider: IProvider[] = [
    { instance: userRouter, prefix: "user" },
    { instance: objectiveRouter, prefix: "to-do" }
];
