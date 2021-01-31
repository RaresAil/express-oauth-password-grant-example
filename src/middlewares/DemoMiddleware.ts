import { Request, Response, NextFunction } from 'express';
import { Middleware } from 'adr-express-ts/lib/@types';
import { Inject } from 'adr-express-ts';

@Inject
export default class DemoMiddleware implements Middleware {
  public async middleware(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    (req as any).myData = 'My custom request data!';
    return next();
  }
}
