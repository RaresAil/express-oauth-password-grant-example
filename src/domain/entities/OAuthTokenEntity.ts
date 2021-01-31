import { InjectedEntity } from 'adr-express-ts/lib/@types';
import { Inject, Retrive, Entity } from 'adr-express-ts';
import mongoose from 'mongoose';

import OAuthDatabase from '../../auth/database';

@Inject
@Entity('OAuthToken')
export default class TokenEntity implements InjectedEntity {
  @Retrive('OAuthDatabase')
  private database?: OAuthDatabase;

  async onLoad(): Promise<void> {
    if (!this.database?.Connection) {
      throw new Error('The OAuth2 Database is not connected!');
    }

    const schema = new mongoose.Schema(
      {
        accessToken: {
          type: String,
          required: true
        },
        userId: {
          type: String,
          required: true
        },
        clientId: {
          type: String,
          required: true
        },
        refreshToken: {
          type: String,
          required: false
        },
        scope: {
          type: [String],
          required: false
        },
        accessTokenExpiresAt: {
          type: Date,
          required: false
        },
        refreshTokenExpiresAt: {
          type: Date,
          required: false
        }
      },
      {
        timestamps: true
      }
    );

    schema.index(
      {
        accessToken: 1,
        userId: 1
      },
      {
        unique: true
      }
    );

    const Model = this.database.Connection.model('Token', schema);

    /**
     * Keep these indexes in order to have auto delete for expired tokens
     *
     * The tokens with only access token will expire by the accessTokenExpiresAt
     * and the tokens and with refresh token will expire by the refreshTokenExpiresAt
     */
    Model.collection.createIndex(
      {
        accessTokenExpiresAt: 1
      },
      {
        expireAfterSeconds: 0,
        partialFilterExpression: {
          accessTokenExpiresAt: {
            $exists: true
          },
          refreshTokenExpiresAt: null
        }
      }
    );
    Model.collection.createIndex(
      {
        refreshTokenExpiresAt: 1
      },
      {
        expireAfterSeconds: 0,
        partialFilterExpression: {
          refreshTokenExpiresAt: {
            $exists: true
          }
        }
      }
    );
  }
}
