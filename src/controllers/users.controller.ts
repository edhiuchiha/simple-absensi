import {Body, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors} from "@nestjs/common";
import {Result} from "../utils/query-result/result.class";
import RegisterUserDto from "../dtos/RegisterUserDto";
import UsersService from "../services/users.service";
import Users from "../models/users.entity";
import ResponseUtil from "../utils/response-util/response.util";
import Routes from "../config/app.routes";
import CookieGuard from "../services/security/cookie.guard";

@Controller(Routes.USERS)
@UseInterceptors(ResponseUtil)
@UseGuards(CookieGuard)
class UsersController {

    constructor(private readonly userService: UsersService) {}

    @Get()
    async get(
        @Query('term') term?: string,
        @Query('order') order : 'username' | 'email' = 'username',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
        @Query('page') page=1
    ): Promise<Result<Users[]>> {
        return await this.userService.findAll({order, sort, term, page})
    }

    @Get("/profile")
    async getProfile(): Promise<Result<Users>> {
        try {
            const user = await this.userService.findUser()
            return { result: user }
        } catch (e){
            throw e;
        }
    }

    @Post()
    async register(@Body() payload: RegisterUserDto): Promise<Result<Users>>{
        try {
            const user: Users = await this.userService.save(payload)
            return { result : user }
        } catch (e){
            throw e;
        }
    }

}

export default UsersController
