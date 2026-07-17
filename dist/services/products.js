"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = createProduct;
exports.listProducts = listProducts;
const admin_1 = require("../firebase/admin");
const productsRef = () => admin_1.realtimeDb.ref('products');
async function createProduct(input, image, admin) {
    const ref = productsRef().push();
    const id = ref.key;
    if (!id) {
        throw new Error('Unable to create product id.');
    }
    const product = {
        id,
        ...input,
        notes: input.notes ?? [],
        imageUrl: image.imageUrl,
        imagePath: image.imagePath,
        createdAt: new Date().toISOString(),
        createdBy: admin,
    };
    await ref.set(product);
    return product;
}
async function listProducts() {
    const snapshot = await productsRef().once('value');
    const value = snapshot.val();
    if (!value) {
        return [];
    }
    return Object.values(value).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
