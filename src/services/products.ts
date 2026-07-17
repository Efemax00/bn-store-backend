import { realtimeDb } from "../firebase/admin";
import type { CreateProductInput } from "../schemas/productSchema";

export type ProductStatus = "available" | "sold-out";

export type Product = {
  id: string;

  name: string;

  manufacturer: string;

  type?: string;

  description?: string;

  notes: string[];

  price: number;

  currency: string;

  size?: string;

  stock: number;

  status: "available" | "sold-out" | "pre-order";

  imageUrl: string;

  imagePath: string;

  createdAt: string;

  updatedAt: string;

  createdBy: {
    uid: string;
    email?: string;
  };
};

const productsRef = () => realtimeDb.ref("products");

function getStatus(stock: number): ProductStatus {
  return stock > 0 ? "available" : "sold-out";
}

export async function createProduct(
  input: CreateProductInput,
  image: { imageUrl: string; imagePath: string },
  admin: { uid: string; email?: string },
) {
  const ref = productsRef().push();

  const id = ref.key;

  if (!id) {
    throw new Error("Unable to create product id.");
  }

  const now = new Date().toISOString();

  const product: Product = {
    id,

    name: input.name,
    manufacturer: input.manufacturer,

    price: input.price,
    currency: input.currency,

    size: input.size,

    type: input.type,

    description: input.description,

    notes: input.notes ?? [],

    stock: input.stock,

    status: getStatus(input.stock),

    imageUrl: image.imageUrl,
    imagePath: image.imagePath,

    createdAt: now,
    updatedAt: now,

    createdBy: admin,
  };

  await ref.set(product);

  return product;
}

export async function listProducts() {
  const snapshot = await productsRef().once("value");

  const value = snapshot.val() as Record<string, Product> | null;

  if (!value) {
    return [];
  }

  return Object.values(value).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export async function getProduct(id: string) {
  const snapshot = await productsRef().child(id).get();

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.val();
}

export async function updateProduct(
  id: string,
  input: Partial<CreateProductInput>,
) {
  const ref = productsRef().child(id);

  const snapshot = await ref.get();

  if (!snapshot.exists()) {
    throw new Error("Product not found.");
  }

  await ref.update({
    ...input,
    updatedAt: new Date().toISOString(),
  });

  const updated = await ref.get();

  return updated.val();
}

export async function deleteProduct(id: string) {
  const ref = productsRef().child(id);

  const snapshot = await ref.get();

  if (!snapshot.exists()) {
    throw new Error("Product not found.");
  }

  await ref.remove();
}
