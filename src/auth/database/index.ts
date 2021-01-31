import { Configuration, Inject, Retrive } from 'adr-express-ts';
import { InjectedEntity } from 'adr-express-ts/lib/@types';
import mongoose from 'mongoose';

@Inject
export default class OAuthDatabase implements InjectedEntity {
  @Retrive('Configuration')
  private config?: Configuration;

  private connection?: mongoose.Connection;

  public get Connection() {
    return this.connection;
  }

  public getModel(name: 'Client' | 'Token') {
    return this.connection?.models[name.toString()];
  }

  async onLoad() {
    await this.initDb();
  }

  private get Log() {
    return this.config?.debug?.log ?? (() => {});
  }

  private async initDb() {
    this.Log('Connecting to OAuth database');
    const { OAUTH_DATABASE_CONN } = process.env as any;

    this.connection = await mongoose.createConnection(OAUTH_DATABASE_CONN, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    });
    this.Log('OAuth database connected');
  }
}

interface EntityLoader {
  (connection: mongoose.Connection): void;
}
