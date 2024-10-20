import express from "express";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validate from "../../middleware/validation";
import { createUserSchema, loginSchema, usersTable } from "../../db/schema";
import { db } from "../../db";

export interface User {
  role: string;
  id: number;
  email: string;
  password: string;
  name: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const router = express.Router();

const generateUserToken = (user: User) => {
  return jwt.sign({ userId: user.id, role: user.role }, "CHANGE_ME", {
    expiresIn: "30d",
  });
};

router.post("/register", validate(createUserSchema), async (req, res) => {
  try {
    const data = req.cleanBody;

    data.password = await bcrypt.hash(data.password, 10);

    const [user] = await db.insert(usersTable).values(data).returning();

    // @ts-expect-error
    delete user.password;

    const token = generateUserToken(user);

    return res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "something went wrong" });
  }
});

router.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.cleanBody;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      return res.status(401).json({ error: "Auth failed" });
    }

    const token = generateUserToken(user);

    // @ts-expect-error
    delete user.password;

    return res.status(200).json({
      token,
      user,
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Auth failed",
    });
  }
});
