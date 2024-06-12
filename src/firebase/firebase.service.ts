import { Injectable, OnModuleInit } from "@nestjs/common";
import { initializeApp } from "firebase-admin/app";
import { credential } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

@Injectable()
export class FirebaseService implements OnModuleInit {
    onModuleInit() {
        const serviceAccount = require("../../serviceAccountDev.json");
        console.log('serviceAccount', serviceAccount);
        console.log('process.env.STORAGE_BUCKET_NAME', process.env.STORAGE_BUCKET_NAME);
        initializeApp({
            credential: credential.cert(serviceAccount),
            storageBucket: process.env.STORAGE_BUCKET_NAME
        });
    }

    getAuth() {
        return getAuth();
    }

    getStorage() {
        return getStorage();
    }
}