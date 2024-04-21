import { ForbiddenException, HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { getAuth } from 'firebase-admin/auth';
import { StorageService } from '../firebase/storage.service';



@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly storageService: StorageService,

  ) { }
  async onModuleInit() {
    const dicebearCore = await import('@dicebear/core');
    this.createAvatar = dicebearCore.createAvatar;
    const dicebearCollection = await import('@dicebear/collection');
    this.initials = dicebearCollection.initials;
  }

  private createAvatar: any;
  private initials: any;

  async validateUser(idToken: string): Promise<User> {
    try {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      let user = await this.usersRepository.findOne({ where: { uid } });
      if (!user) {
        user = await this.usersRepository.save({ uid });


        const avatarSVG = await this.createAvatar(this.initials, {
          seed: decodedToken.name || decodedToken.email,
        }).toArrayBuffer();

        const path = await this.storageService.uploadFile({
          file: {
            buffer: Buffer.from(avatarSVG),
            mimetype: 'image/svg+xml',
            originalname: 'avatar.svg',
          } as Express.Multer.File,
          key: `user/${user.id}/avatar.svg`,
        });
        console.log(path);
        user.avatar_img_path = path;
        await this.usersRepository.save(user);
        return await this.usersRepository.findOne({ where: { uid } });
      }

      return user;
    } catch (error) {
      if (error.code === 'auth/id-token-expired') {
        throw new ForbiddenException('Token expired');
      }
      throw error;
    }
  }

  async loginWithEmail(email: string, password: string) {
    const user = await getAuth().getUserByEmail(email);
    const token = await getAuth().createCustomToken(user.uid);

    return await this.exchangeIdToken(token);
  }

  async exchangeIdToken(idToken: string) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "token": idToken,
      "returnSecureToken": true
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    try {
      const res = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=" + process.env.FIREBASE_API_KEY, requestOptions)
      const data = await res.json();
      return data;
    } catch (error) {
      throw error;
    }

  }


}
