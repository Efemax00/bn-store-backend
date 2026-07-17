"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductSchema = void 0;
const zod_1 = require("zod");
const numberFromForm = zod_1.z.preprocess((value) => {
    if (typeof value === 'string') {
        const normalized = value.replace(/,/g, '').trim();
        return normalized === '' ? undefined : Number(normalized);
    }
    return value;
}, zod_1.z.number().positive());
const optionalString = zod_1.z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined));
const notesFromForm = zod_1.z.preprocess((value) => {
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === 'string') {
        return value
            .split(',')
            .map((note) => note.trim())
            .filter(Boolean);
    }
    return [];
}, zod_1.z.array(zod_1.z.string().min(1)).default([]));
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(120),
    price: numberFromForm,
    currency: zod_1.z.string().trim().length(3).default('NGN'),
    size: optionalString,
    type: optionalString,
    description: optionalString,
    notes: notesFromForm,
    status: zod_1.z.enum(['available', 'sold-out', 'pre-order']).default('available'),
});
