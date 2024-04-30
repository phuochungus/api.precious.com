import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as admin from 'firebase-admin';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user/user.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const idToken = request.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
      throw new UnauthorizedException('ID token is missing');
    }

    return this.validateToken(idToken, context);
  }

  async validateToken(
    idToken: string,
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      if (!decodedToken) {
        throw new UnauthorizedException('Invalid ID token');
      }

      // Attach the decoded token to the request so it can be used in your controllers
      const user = await this.userService.findByUid(decodedToken.uid);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      context.switchToHttp().getRequest().user = user;

      return true;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Failed to authenticate token');
    }
  }
}
