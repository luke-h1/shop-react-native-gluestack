import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return next();
  }

  try {
    const decoded = jwt.verify(token, "CHANGE_ME");

    if (typeof decoded !== "object" || !decoded?.userId) {
      res.status(401).json({ message: "Access denied" });
      return next();
    }

    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (e) {
    res.status(401).json({ message: "Unknown auth error" });
    return next();
  }
}

export function verifySeller(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { role } = req;

  if (role !== "seller") {
    res.status(401).json({ error: "Unauthorized" });
    return next();
  }
  next();
}
