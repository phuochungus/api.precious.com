import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/User';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject('FIREBASE_ADMIN') private firebaseAuth: admin.auth.Auth,
  ) {}

  async validateUser(idToken: string): Promise<User> {
    const decodedToken = await this.firebaseAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    let user = await this.usersRepository.findOne({ where: { uid } });
    if (!user) {
      user = this.usersRepository.create({ uid });
      await this.usersRepository.save(user);
    }

    return user;
  }
}
