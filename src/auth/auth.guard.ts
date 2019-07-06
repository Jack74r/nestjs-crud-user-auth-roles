
import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { JwtPayload } from './interfaces/JwtPayload.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private readonly authService: AuthService,
        private readonly reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        //Get roles from decoratoros
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        //Get token from req/headers/authorization
        const req = context.switchToHttp().getRequest();
        const authorization = req.headers.authorization;
        const token = authorization.split(' ')[1];
        //Token is null or Bad token
        if (!token || !this.authService.verify(token)) {
            throw new UnauthorizedException("You do not have permission (Token)");
        }
        //Convert token to jwtPayload object                
        const payload: JwtPayload = this.authService.decode(token);
        // id from token exist in DB ?
        const user = await this.authService.validateUser(payload);
        if (!user) {
            throw new UnauthorizedException("You do not have permission (Authentification)");
        }
        //No roles in decorators
        if (!roles) {
            return true;
        }
        // UserRole == One of Roles from decorators ?
        const hasRole = (): boolean => roles.includes(user.role);
        if (!user || !user.role || !hasRole()) {
            throw new UnauthorizedException("You do not have permission (Roles)");
        }
        return true;
    }

    handleRequest(err, user) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}