import { Action, Retrive, Response, Post } from 'adr-express-ts';
import { Response as ExpressResponse } from 'express';

import OAuthResponder from '../../responders/OAuthResponder';

@Action('/oauth2')
export default class OAuth2Action {
  @Retrive('Responder.OAuth')
  private responder?: OAuthResponder;

  // We don't have a register function because that is not part of OAuth2,
  // You will have to create a Register method and login the user in
  // PasswordGrant.ts in getUser function.
  @Post('/login', ['OAuth2.Login'])
  public login(@Response res: ExpressResponse): any {
    return this.responder!.successLogin(res);
  }
}
