import { Inject, Responder } from 'adr-express-ts';
import { Token } from 'oauth2-server';
import { Response } from 'express';

import { cookieOptions, createJWT } from '../auth/utils';
import authConfig from '../auth/config.json';

@Inject
@Responder('OAuth')
export default class OAuthResponder {
  public successLogin(res: Response) {
    const token = res.locals?.oauth?.token as Token;
    const tokenExpireDate = token?.accessTokenExpiresAt?.getTime() ?? 0;

    if (tokenExpireDate <= 0) {
      return res.status(401).json({
        success: false
      });
    }

    const expireIn = tokenExpireDate - Date.now();

    return res
      .cookie(
        authConfig.cookieName,
        createJWT(
          {
            token: token.accessToken,
            client: token.client.id,
            user: token.user.id,
            id: token.id
          },
          expireIn
        ),
        cookieOptions(expireIn)
      )
      .status(201)
      .json({
        success: true
      });
  }
}
