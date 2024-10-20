import express, { urlencoded } from "express";
import authRoutes from "./routes/auth";
import orderRoutes from "./routes/auth";
import productRoutes from "./routes/products";

import serverless from "serverless-http";

const PORT = 8000;

const app = express();

app.use(urlencoded({ extended: false }));
app.use(express.json());

app.get("/api/v1/healthcheck", (req, res) => {
  return res.status(200).json({ status: "OK" });
});

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/orders", orderRoutes);

if (process.env.NODE_ENV === "development") {
  app.listen(PORT, () => {
    console.info("server listening on", PORT);
  });
}
export const handler = serverless(app);
