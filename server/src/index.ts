import express, { urlencoded } from "express";
import productsRoutes from "./routes/products";
import authRoutes from "./routes/auth";
import ordersRoutes from "./routes/orders";

import serverless from "serverless-http";

const PORT = 8000;

const app = express();

app.use(urlencoded({ extended: false }));
app.use(express.json());

app.get("/api/v1/health", (req, res) => {
  return res.status(200).json({ status: "OK" });
});

app.use("/api/v1/products", productsRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/orders", ordersRoutes);

if (process.env.NODE_ENV === "development") {
  app.listen(PORT, () => {
    console.info("server listening on", PORT);
  });
}
export const handler = serverless(app);
