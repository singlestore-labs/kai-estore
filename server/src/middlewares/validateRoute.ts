import { RequestHandler } from "express";
import { AnyZodObject, ZodEffects } from "zod";

export function validateRoute<T extends (AnyZodObject | ZodEffects<any> | undefined)[]>(...schemas: T) {
  return (async (req, res, next) => {
    try {
      for await (const schema of schemas) {
        if (!schema) continue;

        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  }) satisfies RequestHandler;
}
