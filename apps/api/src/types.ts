import {
    ContextConfigDefault,
    FastifyBaseLogger,
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    FastifySchema,
    FastifyTypeProviderDefault,
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault,
    RouteGenericInterface,
    RouteHandlerMethod,
} from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { ResolveFastifyReplyType } from "fastify/types/type-provider";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
    interface FastifyRequest {
        prisma: PrismaClient;
    }
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}

export type FastifyTypebox = FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    FastifyBaseLogger,
    TypeBoxTypeProvider
>;

export type FastifyRequestTypebox<TSchema extends FastifySchema> =
    FastifyRequest<
        RouteGenericInterface,
        RawServerDefault,
        RawRequestDefaultExpression<RawServerDefault>,
        TSchema,
        TypeBoxTypeProvider
    >;

export type FastifyReplyTypebox<TSchema extends FastifySchema> = FastifyReply<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    RouteGenericInterface,
    ContextConfigDefault,
    TSchema,
    FastifyTypeProviderDefault,
    ResolveFastifyReplyType<TypeBoxTypeProvider, TSchema, RouteGenericInterface>
>;

export type RouteHandlerMethodTypebox<TSchema extends FastifySchema> =
    RouteHandlerMethod<
        RawServerDefault,
        RawRequestDefaultExpression<RawServerDefault>,
        RawReplyDefaultExpression<RawServerDefault>,
        RouteGenericInterface,
        ContextConfigDefault,
        TSchema,
        TypeBoxTypeProvider,
        FastifyBaseLogger
    >;
