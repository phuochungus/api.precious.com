import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { FirebaseService } from './firebase.service';

@Module({
  providers: [
    FirebaseService,
    StorageService
  ],
  exports: [StorageService, FirebaseService],
})
export class FirebaseModule { }
