import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule } from '../firebase/firebase.module';
import { Admin } from 'src/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Admin]), FirebaseModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
