"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
const env_1 = require("../config/env");
const admin_1 = require("../firebase/admin");
const getBearerToken = (authorization) => {
    if (!authorization?.startsWith('Bearer ')) {
        return null;
    }
    return authorization.slice('Bearer '.length).trim();
};
async function requireAdmin(req, res, next) {
    try {
        const token = getBearerToken(req.header('authorization'));
        if (!token) {
            return res.status(401).json({
                message: 'Missing admin authorization token.',
            });
        }
        const decodedToken = await admin_1.firebaseAuth.verifyIdToken(token);
        const email = decodedToken.email?.toLowerCase();
        const uidIsAllowed = env_1.env.ADMIN_UID_LIST.includes(decodedToken.uid);
        const emailIsAllowed = Boolean(email && env_1.env.ADMIN_EMAIL_LIST.includes(email));
        if (!uidIsAllowed && !emailIsAllowed) {
            return res.status(403).json({
                message: 'This Firebase user is not allowed to manage products.',
            });
        }
        // Attach authenticated admin to the request
        req.admin = {
            uid: decodedToken.uid,
            email: decodedToken.email,
        };
        next();
    }
    catch (error) {
        console.error('Admin authentication failed:', error);
        return res.status(401).json({
            message: 'Invalid or expired admin token.',
        });
    }
}
