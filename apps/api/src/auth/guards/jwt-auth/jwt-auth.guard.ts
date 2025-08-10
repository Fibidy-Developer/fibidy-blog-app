import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable, from, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwtValidation = super.canActivate(context);

    if (jwtValidation instanceof Observable) {
      return jwtValidation.pipe(
        switchMap((isValid) => {
          if (!isValid) return of(false);
          return this.performAdditionalChecks(context);
        }),
        catchError(this.handleError.bind(this)),
      );
    }

    if (jwtValidation instanceof Promise) {
      return from(jwtValidation).pipe(
        switchMap((isValid) => {
          if (!isValid) return of(false);
          return this.performAdditionalChecks(context);
        }),
        catchError(this.handleError.bind(this)),
      );
    }

    if (jwtValidation) {
      return this.performAdditionalChecks(context);
    }

    return of(false);
  }

  private performAdditionalChecks(
    context: ExecutionContext,
  ): Observable<boolean> {
    const request = this.getRequest(context);
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    this.logger.log(`JWT validation passed for user: ${user.id}`);
    return of(true);
  }

  public getRequest(context: ExecutionContext) {
    const isGraphQL = context.getType().toString() === 'graphql';
    if (isGraphQL) {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req;
    }
    return context.switchToHttp().getRequest();
  }

  private handleError(error: any): Observable<never> {
    this.logger.error(`Authentication failed: ${error.message}`);
    throw error;
  }
}
