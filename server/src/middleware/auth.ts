import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "CHANGE_ME");

    if (typeof decoded !== "object" || !decoded?.userId) {
      return res.status(401).json({ message: "Access denied" });
    }

    req.userId = decoded.userId;
    req.role = decoded.role;
  } catch (e) {
    return res.status(401).json({ message: "Unknown auth error" });
  }
}

export function verifySeller(req: Request, res: Response, next: NextFunction) {
  const { role } = req;

  if (role !== "seller") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
