import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as stockManager from "./stockManager";
import * as newsManager from "./newsManager";
import crypto from "crypto";

// Helper to generate or retrieve session ID from cookies
function getOrCreateSessionId(req: any, res: any): string {
  const SESSION_COOKIE = 'stock_session_id';
  let sessionId = req.cookies?.[SESSION_COOKIE];
  
  if (!sessionId) {
    sessionId = crypto.randomBytes(32).toString('hex');
    res.cookie(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });
  }
  
  return sessionId;
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  news: router({    list: publicProcedure.query(async () => {
      return await newsManager.getAllNews();
    }),
    
    recent: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await newsManager.getRecentNews(input?.limit);
      }),
    
    create: publicProcedure
      .input(z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        author: z.string().min(1),
        priority: z.enum(['high', 'medium', 'low']).optional(),
      }))
      .mutation(async ({ input }) => {
        return await newsManager.createNewsPost(
          input.title,
          input.content,
          input.author,
          input.priority
        );
      }),
    
    update: publicProcedure
      .input(z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        author: z.string().optional(),
        priority: z.enum(['high', 'medium', 'low']).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        return await newsManager.updateNewsPost(id, updates);
      }),
    
    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return await newsManager.deleteNewsPost(input.id);
      }),
  }),

  stocks: router({
    list: publicProcedure.query(async () => {
      return await stockManager.getStocks();
    }),
    
    marketStatus: publicProcedure.query(async () => {
      return await stockManager.getMarketStatus();
    }),
    
    submitVote: publicProcedure
      .input(z.object({
        rankings: z.array(z.string()).length(10),
      }))
      .mutation(async ({ ctx, input }) => {
        const sessionId = getOrCreateSessionId(ctx.req, ctx.res);
        return await stockManager.submitVote(sessionId, input.rankings);
      }),
    
    getUserVote: publicProcedure.query(async ({ ctx }) => {
      const sessionId = getOrCreateSessionId(ctx.req, ctx.res);
      return await stockManager.getSessionVoteToday(sessionId);
    }),
    
    hasVotedToday: publicProcedure.query(async ({ ctx }) => {
      const sessionId = getOrCreateSessionId(ctx.req, ctx.res);
      return await stockManager.hasSessionVotedToday(sessionId);
    }),
  }),
});

export type AppRouter = typeof appRouter;
