import {Injectable, CanActivate, ExecutionContext, Headers} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {ROLES_KEY} from "./roles.decorator";
import {Role} from "./role.enum";
import axios from "axios";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        // console.log('requiredRoles', requiredRoles);
        if (!requiredRoles) {
            return true;
        }

        const authHeader = context.switchToHttp().getRequest().headers.authorization;
        console.log('RolesGuard.authHeader', authHeader);

        const rc = await axios.get(process.env.EAGLE_AUTH_SERVER_URL + '/v1/auth/roles?authHeader=' + authHeader);
        const userRoles = rc?.data as string[];
        console.log('requiredRoles', requiredRoles);
        console.log('userRoles', userRoles);
        const fullfillments: boolean[] = requiredRoles.map(reqRole => userRoles.indexOf(reqRole) !== -1 || userRoles.indexOf('Admin') !== -1);

        let hasAllRoles: boolean = true;
        for (let hasRole of fullfillments) {
            hasAllRoles = hasAllRoles && hasRole;
        }
        return hasAllRoles;
    }
}
