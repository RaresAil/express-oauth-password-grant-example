import { Action, Get, Retrive, Response } from 'adr-express-ts';
import { Response as ExpressResponse } from 'express';

@Action('/', ['OAuth2.Restrict'])
export default class ProtectedAction {
  @Get('/test', [])
  public findAll(@Response res: ExpressResponse): any {
    const token = res.locals?.oauth?.token;

    return res.send({
      success: true,
      userId: token?.user?.id
    });
  }
}
