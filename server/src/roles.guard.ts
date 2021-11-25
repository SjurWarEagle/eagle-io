import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {ROLES_KEY} from "./roles.decorator";
import {Role} from "./role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log('requiredRoles', requiredRoles);
        if (!requiredRoles) {
            return true;
        }

        //TODO return requiredRoles.some((role) => user.roles?.includes(role));
        return true;
    }
}
