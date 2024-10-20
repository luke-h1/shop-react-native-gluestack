import express from "express";
import {
  insertOrderWithItemsSchema,
  orderItemsTable,
  ordersTable,
  updateOrderSchema,
} from "../db/schema";
import { verifyToken } from "../middleware/auth";
import validate from "../middleware/validation";
import { db } from "../db";
import { eq } from "drizzle-orm";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  validate(insertOrderWithItemsSchema),
  async (req, res) => {
    try {
      const { order, items } = req.cleanBody;

      const { userId } = req;

      if (!userId) {
        return res.status(400).json({ message: "Invalid order data" });
      }

      const [newOrder] = await db
        .insert(ordersTable)
        .values({ userId: userId })
        .returning();

      const orderItems = items.map((item) => ({
        ...item,
        orderId: newOrder.id,
      }));

      const newOrderItems = await db
        .insert(orderItemsTable)
        .values(orderItems)
        .returning();

      return res.status(201).json({
        ...newOrder,
        items: newOrderItems,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        message: "Invalid order data",
      });
    }
  }
);

router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable);
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const orderWithItems = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id))
      .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.id));

    if (orderWithItems.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const mergedOrder = {
      ...orderWithItems[0].orders,
      items: orderWithItems.map((o) => o.order_items),
    };

    return res.status(200).json(mergedOrder);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

router.put(
  "/:id",
  verifyToken,
  validate(updateOrderSchema),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      const [updatedOrder] = await db
        .update(ordersTable)
        .set(req.body)
        .where(eq(ordersTable.id, id))
        .returning();

      if (!updatedOrder) {
        return res.status(404).json({ message: "order not found" });
      }
      return res.status(201).json(updatedOrder);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

export default router;
