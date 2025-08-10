// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Observable } from 'rxjs';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}
