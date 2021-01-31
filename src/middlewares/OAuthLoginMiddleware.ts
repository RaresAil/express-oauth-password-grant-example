import { Request, Response, NextFunction } from 'express';
import { Middleware } from 'adr-express-ts/lib/@types';
import { Inject, Retrive } from 'adr-express-ts';

import PasswordGrant from '../auth/PasswordGrant';
import authConfig from '../auth/config.json';

/**
 * This middleware is injected in auth/PasswordGrant.ts as OAuth2.Login
 */

@Inject
export default class OAuthLoginMiddleware implements Middleware {
  @Retrive('PasswordGrant')
  private passwordGrant?: PasswordGrant;
  private functionMiddleware?: any;

  public async middleware(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    if (!this.functionMiddleware) {
      this.functionMiddleware = this.passwordGrant?.server.token();
      if (!this.functionMiddleware) {
        throw new Error('INVALID MIDDLEWARE');
      }
    }

    req.headers.authorization = this.parseAuthorization(
      req.headers.authorization
    );

    return this.functionMiddleware(req, res, next);
  }

  private parseAuthorization(authorization?: string): string | undefined {
    try {
      const client = authorization?.split(' ') ?? [];
      if (client[0] !== 'Basic' || !client[1]) {
        return;
      }

      const credentials = Buffer.from(client[1], 'base64')
        .toString()
        .split(':');

      if (!credentials[0]) {
        return;
      }

      // Make some validation here. e.g. google reCaptcha
      // in order to block bots

      return `Basic ${Buffer.from(
        `${credentials[0]}:${authConfig.clientSecret}`,
        'utf8'
      ).toString('base64')}`;
    } catch {
      return;
    }
  }
}
