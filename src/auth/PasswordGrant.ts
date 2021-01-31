import { Inject, Injector, Retrive } from 'adr-express-ts';
import { isDeepStrictEqual } from 'util';
import mongoose from 'mongoose';
import {
  InvalidScopeError,
  PasswordModel,
  Client,
  Token,
  User
} from 'oauth2-server';

import OAuthRestrictMiddleware from '../middlewares/OAuthRestrictMiddleware';
import OAuthLoginMiddleware from '../middlewares/OAuthLoginMiddleware';
import { InjectType } from 'adr-express-ts/lib/@types';
import { addIfExists, formatDBObject } from './utils';
import OAuthServer from './wrapper/OAuthServer';
import { OAuthToken } from './@types/Entities';
import authConfig from './config.json';
import OAuthDatabase from './database';

@Inject
export default class PasswordGrant {
  public readonly SESSION_EXPIRE_TIME = 3600;

  @Retrive('OAuthDatabase')
  private database?: OAuthDatabase;

  public readonly server: OAuthServer;

  constructor() {
    Injector.inject('OAuthDatabase', OAuthDatabase);
    Injector.inject(
      'OAuth2.Login',
      OAuthLoginMiddleware,
      InjectType.Middleware
    );
    Injector.inject(
      'OAuth2.Restrict',
      OAuthRestrictMiddleware,
      InjectType.Middleware
    );

    this.server = new OAuthServer({
      model: this.Model,
      // Here you can define the session time in seconds
      // Default is 3600s = 1 hour
      accessTokenLifetime: this.SESSION_EXPIRE_TIME,
      continueMiddleware: {
        // We set this to true, so when the user passed the OAuth2 token creation
        // To be sent to the responder where we will save the accessToken in
        // the cookie jar
        token: true
      }
    });
  }

  private user: User = {
    id: '1',
    username: 'Rares'
  };

  private get Model(): PasswordModel {
    return {
      verifyScope: async (
        token: Token,
        scope: string | string[]
      ): Promise<boolean> => false,
      getUser: async (username: string, password: string): Promise<any> => {
        console.log('%o %o %o', 'getUser', username, password);

        /**
         * Implement a function to get your user
         */

        return this.user;
      },
      getClient: async (
        clientId: string,
        clientSecret?: string
      ): Promise<Client | null> => {
        try {
          if (!mongoose.isValidObjectId(clientId)) {
            return null;
          }

          const Client = this.database?.getModel('Client');
          const clientData = (
            await Client?.findOne(
              {
                _id: mongoose.Types.ObjectId(clientId),
                grants: 'password',
                secret: clientSecret
              },
              {
                __v: 0,
                _id: 0
              }
            )
          )?.toObject();

          return clientData
            ? {
                ...clientData,
                id: clientId
              }
            : null;
        } catch {
          return null;
        }
      },
      saveToken: async (
        token: Token,
        client: Client,
        user: User
      ): Promise<Token | null> => {
        try {
          const Token = this.database?.getModel('Token');
          if (!Token) {
            return null;
          }

          // We make sure that the scope is a string array
          const scope =
            typeof token.scope === 'string' ? [token.scope] : token.scope;

          // Check if the user only sent the `login` scope
          // You can change this and add multiple scopes if you want
          if (!isDeepStrictEqual(scope, authConfig.scope)) {
            throw new InvalidScopeError(
              'The provided scope is not a valid one'
            );
          }

          let tokenData: OAuthToken = {
            accessToken: token.accessToken,
            clientId: client.id,
            userId: user.id
          };

          addIfExists(
            token.accessTokenExpiresAt,
            'accessTokenExpiresAt',
            tokenData
          );
          addIfExists(scope, 'scope', tokenData);

          // I removed the refresh token because we don't need it in this case
          // If you want to add it, uncomment the following lines
          // If you save the refreshToken, in the database, the document will be
          // delted only after the refresh token expires
          //
          // addIfExists(
          //   token.refreshTokenExpiresAt,
          //   'refreshTokenExpiresAt',
          //   tokenData
          // );
          // addIfExists(token.refreshToken, 'refreshToken', tokenData);
          //

          const { clientId, userId, ...dbToken } = (
            await new Token(tokenData).save()
          ).toObject(formatDBObject);

          return {
            ...dbToken,
            client,
            user
          };
        } catch (err) {
          // Throw the error to the user if the scope is invalid
          if (err?.name === 'invalid_scope') {
            throw err;
          }

          return null;
        }
      },
      getAccessToken: async (accessToken: string): Promise<Token | null> => {
        try {
          const Token = this.database?.getModel('Token');
          const Client = this.database?.getModel('Client');
          if (!Token || !Client) {
            return null;
          }

          const { clientId, userId, ...token } =
            (
              await Token.findOne({
                accessToken
              })
            )?.toObject(formatDBObject) || {};
          if (!clientId) {
            return null;
          }

          // Check to have only the 'login' scope in the request
          // if the return value is null, OAuth will sent 401 Unauthorised
          if (!isDeepStrictEqual(token.scope, authConfig.scope)) {
            return null;
          }

          const client = (await Client.findById(clientId))?.toObject(
            formatDBObject
          );
          if (!client) {
            return null;
          }

          return {
            ...token,
            client,
            user: this.user
          } as Token;
        } catch (e) {
          return null;
        }
      }
    };
  }
}
