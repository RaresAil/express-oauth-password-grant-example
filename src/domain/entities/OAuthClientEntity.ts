import { InjectedEntity } from 'adr-express-ts/lib/@types';
import { Inject, Retrive, Entity } from 'adr-express-ts';
import mongoose from 'mongoose';

import OAuthDatabase from '../../auth/database';

@Inject
@Entity('OAuthClient')
export default class OAuthClientEntity implements InjectedEntity {
  @Retrive('OAuthDatabase')
  private database?: OAuthDatabase;

  async onLoad(): Promise<void> {
    if (!this.database?.Connection) {
      throw new Error('The OAuth2 Database is not loaded!');
    }

    this.database.Connection.model(
      'Client',
      new mongoose.Schema(
        {
          // The secret token
          secret: {
            type: String,
            required: true,
            minlength: 32,
            maxlength: 128
          },
          // For password grant, this one should be your app's name.
          name: {
            type: String,
            required: true
          },
          // When you will create a client, this one should be ['password'].
          grants: {
            type: [String],
            required: true
          },
          // For password grant you don't need this but each client should have an Owner.
          userId: {
            type: String,
            required: false
          },
          // For password grant, you don't need this but you can add it in the response body for the Front-End.
          redirectUris: {
            type: [String],
            required: false
          },
          // For passwod grant, you don't need this, because we set this in PasswordGrant.ts
          accessTokenLifetime: {
            type: Number,
            required: false
          },
          // For password grant, you don't need this
          refreshTokenLifetime: {
            type: Number,
            required: false
          }
        },
        {
          timestamps: true
        }
      )
    );
  }
}
