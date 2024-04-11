import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        const serviceAccount = require('../../config/jewelry-store-uit-firebase-adminsdk-21at7-0fd31d8e1f.json');
        console.log('serviceAccount', serviceAccount);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        return admin.auth();
      },
    },
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule {}
