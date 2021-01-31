import {
  Action,
  Get,
  Retrive,
  Request,
  Response,
  Post,
  Delete,
  Next
} from 'adr-express-ts';
import {
  NextFunction,
  Request as ExpressRequest,
  Response as ExpressResponse
} from 'express';

import DemoResponder from '../responders/DemoResponder';
import DemoDomain from '../domain/DemoDomain';

@Action('/demo')
export default class DemoAction {
  @Retrive('Responder.Demo')
  private responder?: DemoResponder;

  @Retrive('Domain.Demo')
  private domain?: DemoDomain;

  @Get('/demo1')
  public findAll(
    @Request req: ExpressRequest,
    @Response res: ExpressResponse
  ): any {
    return res.send({
      success: true,
      test: (req as any).myData
    });
  }

  @Get()
  public err(@Next next: NextFunction): any {
    return next('Testing');
  }

  @Post()
  public async saveX(@Response res: ExpressResponse): Promise<any> {
    const dataFromDatabase = await this.domain!.test('parameter from action');
    return this.responder!.demo(res, 201, dataFromDatabase);
  }

  @Delete('/:id')
  public async deleteY(
    @Request req: ExpressRequest,
    @Response res: ExpressResponse
  ): Promise<any> {
    return this.responder!.success(res, {
      id: req.params.id
    });
  }
}
