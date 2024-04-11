import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { CartModule } from './cart/cart.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseAuthGuard } from './guard/firebase-auth.guard';
import { User } from './entity/User';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      logging: true,
      entities: ['build/entity/*.js'],
    }),
    FirebaseModule,
    CartModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
