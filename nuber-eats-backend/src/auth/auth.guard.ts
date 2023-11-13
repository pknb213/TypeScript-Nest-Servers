import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {GqlExecutionContext} from "@nestjs/graphql";
import {Reflector} from "@nestjs/core";
import {AllowedRoles} from "./role.decorator";
import {User} from "../users/entities/user.entity";
import { JwtService } from "../jwt/jwt.service";
import { UsersService } from "../users/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
      private readonly reflector: Reflector,
      private readonly jwtService: JwtService,
      private readonly usersService: UsersService,
    ) {}
    async canActivate(context: ExecutionContext) {
        const roles = this.reflector.get<AllowedRoles>(
          'roles',
          context.getHandler()
        )
        console.log("Roles:", roles)
        if (!roles) return true
        const gqlContext = GqlExecutionContext.create(context).getContext()
        // console.log("GQL Context:", gqlContext);
        const token = gqlContext.token;
        if (token) {
            const decoded = this.jwtService.verify(token.toString())
            if (typeof decoded === "object" && decoded.hasOwnProperty('id')) {
                const { user } = await this.usersService.findById(decoded['id'])
                console.log(user)
                if (!user) return false
                gqlContext['user'] = user
                if (roles.includes('Any')) return true
                return roles.includes(user.role)
            } else {
                return false
            }
        } else {
            return false
        }
    }
}