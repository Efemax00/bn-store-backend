import { realtimeDb } from "../firebase/admin";
import { getProduct, updateProduct } from "./products";

const salesRef = () => realtimeDb.ref("sales");

export type Sale = {
  id: string;
  productId: string;
  productName: string;
  manufacturer: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  soldAt: string;
  soldBy: {
    uid: string;
    email?: string;
  };
};

export async function createSale(
  productId: string,
  quantity: number,
  admin: {
    uid: string;
    email?: string;
  },
) {
  const product = await getProduct(productId);

  if (!product) {
    throw new Error("Product not found.");
  }

  if (product.stock < quantity) {
    throw new Error("Insufficient stock.");
  }

  const remainingStock = product.stock - quantity;

  // Update inventory
  await updateProduct(productId, {
    stock: remainingStock,
  });

  const ref = salesRef().push();

  const id = ref.key!;

  const sale: Sale = {
    id,
    productId,
    productName: product.name,
    manufacturer: product.manufacturer,
    quantity,
    unitPrice: product.price,
    totalAmount: product.price * quantity,
    soldAt: new Date().toISOString(),
    soldBy: admin,
  };

  await ref.set(sale);

  return sale;
}

export async function listSales() {
  const snapshot = await salesRef().once("value");

  const value = snapshot.val() as Record<string, Sale> | null;

  if (!value) {
    return [];
  }

  return Object.values(value).sort((a, b) =>
    b.soldAt.localeCompare(a.soldAt),
  );
}