import {InjectRepository} from "@nestjs/typeorm";
import Users from "../models/users.entity";
import {Repository, SelectQueryBuilder} from "typeorm";
import RegisterUserDto from "../dtos/RegisterUserDto";
import HashUtil from "../utils/common-util/hash.util";
import {Result} from "../utils/query-result/result.class";
import UsersQueryDTO from "../dtos/user.query";
import UserStatus from "../enums/user-status.enum";
import {readFileSync} from "fs";
import {resolve} from "path";
import JwtPayload from "../dtos/jwt/jwt-payload.dto";
import { verify as jwtVerify } from 'jsonwebtoken';
import RedisStoreService from "./utility/redis-store.service";
import {Logger} from "@nestjs/common";

class UsersService {

    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
        private readonly hashUtils: HashUtil,
        private readonly redisService: RedisStoreService
    ) {}

    async findAll(queryParams: UsersQueryDTO): Promise<Result<Users[]>>{

        const rowsPerPage = +process.env.DEFAULT_ROWS_PER_PAGE;
        const offset: number = queryParams.page > 1 ? rowsPerPage * (queryParams.page - 1) : 0;
        let query: SelectQueryBuilder<Users> = this.usersRepository.createQueryBuilder('u');

        if (queryParams.term) {
            let { term } = queryParams;
            term = `%${term}%`;
            query = query
                .orWhere('u.username LIKE :term', { term })
                .orWhere('u.email LIKE :term', { term })
        }

        if (queryParams.order && queryParams.sort) {
            const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
            const orderCols: { [key: string]: string } = {
                username: 'u.username',
                email: 'u.email',
            };
            query = query.orderBy(orderCols[queryParams.order], sort);
        } else query = query.orderBy('u.username', 'ASC');

        query.offset(offset);
        query.limit(rowsPerPage);

        const [result, totalRows] = await query.getManyAndCount();

        return {
            result,
            paging: {
                page: queryParams.page,
                rowsPerPage,
                totalPages: Math.ceil(totalRows / rowsPerPage),
                totalRows,
            },
        };
    }

    async findUser(): Promise<Users>{
        const { TOKEN_PUB_PATH, TOKEN_ALGORITHM } = process.env;
        const publicKey: Buffer = readFileSync(resolve(TOKEN_PUB_PATH));
        const algorithms: any = TOKEN_ALGORITHM;
        const token = await this.redisService.get('token')

        try {
            const {user: { id }} = jwtVerify(token, publicKey, { algorithms }) as JwtPayload
            return this.usersRepository.findOne({id})
        } catch (error) {
            Logger.warn(
                `JWT verification failed with message: ${error.message}.`,
                'GuardService@verify',
                true,
            );
        }
    }

    async findByEmailOrUsername(email: string): Promise<Users> {
        const query: SelectQueryBuilder<Users> = this.usersRepository.createQueryBuilder("user");
        query.where("user.email = :email OR user.username = :email", {email})
        return await query.getOne()
    }

    async save(payload: RegisterUserDto): Promise<Users>{
        const user: Users = new Users()
        user.fullname = payload.fullname
        user.username = payload.email
        user.email = payload.email
        user.password = await this.hashUtils.create(payload.password)
        user.status = UserStatus.ACTIVE
        return this.usersRepository.save(user)
    }

    async update(user: Users): Promise<Users> {
        return this.usersRepository.save(user)
    }
}

export default UsersService
