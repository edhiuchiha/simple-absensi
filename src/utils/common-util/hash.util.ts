import * as md5 from 'md5';
import * as randomStr from 'crypto-random-string';
import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt'

@Injectable()
export default class HashUtil {
  createRandomString(
    length = 32,
    type: 'hex' | 'base64' | 'url-safe' = 'hex',
    characters?: string,
  ): string {
    const options: any = { length, type };

    if (characters) {
      delete options.type;
      options.characters = characters;
    }

    return randomStr(options);
  }

  encodeBase64(input: string): string {
    return Buffer.from(input).toString('base64');
  }

  createMd5Hash(input: string): string {
    return md5(input);
  }

  compareMd5Hash(input: string, hash: string): boolean {
    return md5(input) === hash;
  }

  async create(input: string): Promise<string> {
    const saltrounds = Number(process.env.HASH_SALTROUNDS);
    const saltbae: string = await bcrypt.genSalt(saltrounds);

    return bcrypt.hash(input, saltbae);
  }

  async compare(input: string, hash: string): Promise<boolean> {
    const valid: boolean = await bcrypt.compare(input, hash);

    Logger.log(`Compare input and hash result ${valid}`, 'HashUtil@compare', true);

    return valid;
  }

}
