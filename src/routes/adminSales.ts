import { Router } from "express";
import { requireAdmin } from "../middleware/requireAdmin";
import { createSaleSchema } from "../schemas/salesSchema";
import { createSale, listSales } from "../services/sales";

export const adminSalesRouter = Router();

// GET all sales
adminSalesRouter.get(
  "/",
  requireAdmin,
  async (req, res, next) => {
    try {
      if (!req.admin) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const sales = await listSales(req.admin.uid);
      res.json(sales);
    } catch (err) {
      next(err);
    }
  }
);

// POST create sale
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
        req.admin
      );

      res.status(201).json(sale);
    } catch (err) {
      next(err);
    }
  }
);