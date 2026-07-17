import { Router } from "express";
import { requireAdmin } from "../middleware/requireAdmin";
import { createSaleSchema } from "../schemas/saleSchema";
import { createSale } from "../services/sales";

export const adminSalesRouter = Router();

adminSalesRouter.post(
  "/",
  requireAdmin,
  async (req, res, next) => {
    try {
      const input = createSaleSchema.parse(req.body);

      if (!req.admin) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const sale = await createSale(
        input.productId,
        input.quantity,
        req.admin,
      );

      res.status(201).json(sale);
    } catch (err) {
      next(err);
    }
  },
);