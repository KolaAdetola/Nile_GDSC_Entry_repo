import z from "zod";
import { router, publicProcedure } from "../index";
import { feedback } from "@starter/db/schema/feedback";
import { eq } from "drizzle-orm";
import { db } from "@starter/db";

export const feedbackRouter = router({
  getAll: publicProcedure.query(async () => {
    return await db.select().from(feedback);
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.email(),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { name, email, message } = input;
      console.log(input);
      return await db
        .insert(feedback)
        .values({
          name,
          email,
          message,
        })
        .returning();
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db.delete(feedback).where(eq(feedback.id, input.id));
    }),
});
