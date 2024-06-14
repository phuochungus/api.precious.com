import { Injectable } from "@nestjs/common";
import { App, initializeApp } from "firebase-admin/app";
import { credential } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

@Injectable()
export class FirebaseService {
    private app : App;
    private static instance: FirebaseService = null;

    private constructor() {
        const serviceAccount = require("../../serviceAccountDev.json");
        console.log('serviceAccount', serviceAccount);
        console.log('process.env.STORAGE_BUCKET_NAME', process.env.STORAGE_BUCKET_NAME);
        this.app = initializeApp({
            credential: credential.cert(serviceAccount),
            storageBucket: process.env.STORAGE_BUCKET_NAME
        });
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new FirebaseService();
        }
        return this.instance;
    }

    getAuth() {
        return getAuth(this.app)
    }

    getStorage() {
        return getStorage(this.app);
    }
}