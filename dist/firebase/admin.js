"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageBucket = exports.realtimeDb = exports.firebaseAuth = void 0;
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const database_1 = require("firebase-admin/database");
const storage_1 = require("firebase-admin/storage");
const env_1 = require("../config/env");
const privateKey = env_1.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
const serviceAccount = {
    projectId: env_1.env.FIREBASE_PROJECT_ID,
    clientEmail: env_1.env.FIREBASE_CLIENT_EMAIL,
    privateKey,
};
const app = (0, app_1.getApps)()[0] ??
    (0, app_1.initializeApp)({
        credential: (0, app_1.cert)(serviceAccount),
        storageBucket: env_1.env.FIREBASE_STORAGE_BUCKET,
        databaseURL: env_1.env.FIREBASE_DATABASE_URL,
    });
exports.firebaseAuth = (0, auth_1.getAuth)(app);
exports.realtimeDb = (0, database_1.getDatabase)(app);
exports.storageBucket = (0, storage_1.getStorage)(app).bucket();
