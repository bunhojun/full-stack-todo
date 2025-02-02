import { CanActivate, Injectable } from '@nestjs/common';

@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate() {
    return true;
  }
}
