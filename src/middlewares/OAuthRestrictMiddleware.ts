import { Request, Response, NextFunction } from 'express';
import { Middleware } from 'adr-express-ts/lib/@types';
import { Inject, Retrive } from 'adr-express-ts';

import PasswordGrant from '../auth/PasswordGrant';
import authConfig from '../auth/config.json';
import { getJWT } from '../auth/utils';

/**
 * This middleware is injected in auth/PasswordGrant.ts as OAuth2.Restrict
 */

@Inject
export default class OAuthRestrictMiddleware implements Middleware {
  @Retrive('PasswordGrant')
  private passwordGrant?: PasswordGrant;
  private functionMiddleware?: any;

  public async middleware(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    if (!this.functionMiddleware) {
      this.functionMiddleware = this.passwordGrant?.server.authenticate();
      if (!this.functionMiddleware) {
        throw new Error('INVALID MIDDLEWARE');
      }
    }

    req.headers.authorization = this.validateSession(
      (req.signedCookies ?? {})[authConfig.cookieName]
    );

    return this.functionMiddleware(req, res, next);
  }

  private validateSession = (sessionCookie?: string): string | undefined => {
    if (!sessionCookie) {
      return;
    }

    const sessionData = getJWT<any>(sessionCookie);
    return sessionData?.token ? `Bearer ${sessionData?.token}` : undefined;
  };
}
