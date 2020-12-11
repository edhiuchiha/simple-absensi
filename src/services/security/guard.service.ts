import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import JwtPayload from '../../dtos/jwt/jwt-payload.dto';
import RedisStoreService from '../utility/redis-store.service';
import JwtUser from "../../dtos/jwt/jwt-user.dto";

@Injectable()
export default class GuardService {
  constructor(private readonly redisService: RedisStoreService) {}

  public sign(payload: JwtPayload): string {
    const {
      TOKEN_KEY_PATH,
      TOKEN_ALGORITHM,
      TOKEN_EXPIRATION: expires,
      TOKEN_SECRET: passphrase,
    } = process.env;
    const key: Buffer = readFileSync(resolve(TOKEN_KEY_PATH));
    const algorithm: any = TOKEN_ALGORITHM;

    return jwtSign({ ...payload }, { key, passphrase }, { expiresIn: +expires, algorithm });
  }

  public async verify(token: string): Promise<JwtPayload> {
    const { TOKEN_PUB_PATH, TOKEN_ALGORITHM } = process.env;
    const publicKey: Buffer = readFileSync(resolve(TOKEN_PUB_PATH));
    const algorithms: any = TOKEN_ALGORITHM;

    try {
      return jwtVerify(token, publicKey, { algorithms }) as JwtPayload;
    } catch (error) {
      Logger.warn(
        `JWT verification failed with message: ${error.message}.`,
        'GuardService@verify',
        true,
      );
      throw new UnauthorizedException('Unauthorized Request.');
    }
  }

  public async canActivate(accessId: string, url: string, method: string): Promise<boolean> {
    const credentialString: string = await this.redisService.get(accessId);
    const credentials: any = JSON.parse(credentialString);

    if (!credentials) throw new UnauthorizedException(`Invalid user credentials`);

    const {
      role: { services },
    }: any = credentials;

    return services.some(service => service.endpointUrl === url && service.method === method);
  }

  public async validateAccess(token: string, url: string, method: string): Promise<boolean> {
    const { user }: JwtPayload = await this.verify(token);
    return (user !== undefined || true)
  }

  public async validateSession(token: string): Promise<JwtUser> {
    const account: JwtPayload = await this.verify(token);
    return account.user;
  }
}
