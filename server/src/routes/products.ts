import express from "express";
import { db } from "../db";
import { createProductSchema, productsTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { verifySeller, verifyToken } from "../middleware/auth";
import validate from "../middleware/validation";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await db.select().from(productsTable);
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, Number(id)));

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post(
  "/",
  verifyToken,
  verifySeller,
  validate(createProductSchema),
  async (req, res) => {
    try {
      const [product] = await db
        .insert(productsTable)
        .values(req.cleanBody)
        .returning();

      return res.status(201).json(product);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

router.put("/:id", verifyToken, verifySeller, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [product] = await db
      .update(productsTable)
      .set(req.cleanBody)
      .where(eq(productsTable.id, id))
      .returning();

    if (product) {
      return res.status(200).json(product);
    }

    return res.status(404).json({
      message: "Product not found",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.delete("/:id", verifyToken, verifySeller, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [deletedProduct] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning();

    if (deletedProduct) {
      return res.status(204).send();
    }

    return res.status(404).json({ message: "product not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

export default router;
