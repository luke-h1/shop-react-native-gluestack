import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import pick from "lodash/pick";

export default function validate(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      req.cleanBody = pick(req.body, Object.keys(schema.shape));
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));

        return res
          .status(400)
          .json({ error: "Invalid request body", problems: errorMessages });
      } else {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  };
}
