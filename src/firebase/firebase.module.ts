import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { FirebaseService } from './firebase.service';

@Module({
  providers: [
    {
      provide: FirebaseService,
      useValue: FirebaseService.getInstance()
    },
    StorageService
  ],
  exports: [StorageService, FirebaseService],
})
export class FirebaseModule { }
