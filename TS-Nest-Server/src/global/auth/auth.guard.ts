import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {Reflector} from "@nestjs/core";
import {JwtService} from "../jwt/jwt.service";
import {UsersService} from "../../rest/users/users.service";
import {AllowedRoles} from "./role.decorator";
import {GqlExecutionContext} from "@nestjs/graphql";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
      private readonly reflector: Reflector,
      private readonly jwtService: JwtService,
      private readonly usersService: UsersService,
  ) {}
  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean> {
    const roles = this.reflector.get<AllowedRoles>(
        'roles',
        context.getHandler()
    )
    console.log("Roles:", roles)
    if (!roles) return true
    const gqlContext = GqlExecutionContext.create(context).getContext()
    // console.log("GQL Context:", gqlContext.req.headers["x-jwt"]);
    /** Todo: REST로 전송 시 Request Header에 x-jwt 토큰이 포함된다.
     *  Graphql의 경우 아래 GqlContext.token으로 충분하다
     *  그리고 추후 Websocket도 고려해야 한다
     */
    const token = gqlContext.token ? gqlContext.token : gqlContext.req.headers["x-jwt"];
    console.log("Token:", token)
    if (token) {
      const decoded = this.jwtService.verify(token.toString())
      if (typeof decoded === "object" && decoded.hasOwnProperty('id')) {
        const {data: user} = await this.usersService.getUser(decoded['id'])
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
