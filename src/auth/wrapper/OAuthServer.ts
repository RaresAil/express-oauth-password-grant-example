import OAuth2Server, {
  InvalidArgumentError,
  AuthenticateOptions,
  AuthorizeOptions,
  ServerOptions,
  TokenOptions,
  Response,
  Request
} from 'oauth2-server';
import {
  Response as EResponse,
  Request as ERequest,
  NextFunction
} from 'express';

/**
 * DO NOT CHANGE THIS FILE!
 * This is the OAuth2 Server Wrapper
 */

export interface ContinueMiddleware {
  token?: boolean;
  authorize?: boolean;
}
export interface OAuthServerOptions {
  continueMiddleware?: ContinueMiddleware;
}

export default class OAuthServer {
  private readonly server: OAuth2Server;
  private readonly continueMiddleware?: ContinueMiddleware;

  constructor(options: ServerOptions & OAuthServerOptions) {
    if (!options.model) {
      throw new InvalidArgumentError('Missing parameter: "model"');
    }

    this.continueMiddleware = options.continueMiddleware
      ? {
          token: options.continueMiddleware.token,
          authorize: options.continueMiddleware.authorize
        }
      : undefined;
    this.server = new OAuth2Server(options);
  }

  public authorize(options?: AuthorizeOptions) {
    return async (req: ERequest, res: EResponse, next: NextFunction) => {
      try {
        const request = new Request(req);
        const response = new Response(res);

        const code = await this.server.authorize(request, response, options);
        res.locals.oauth = { code: code };

        if (this.continueMiddleware?.authorize) {
          return next();
        }

        this.handleResponse(req, res, response);
      } catch (error) {
        this.handleError(error, res);
      }
    };
  }

  public authenticate(options?: AuthenticateOptions) {
    return async (req: ERequest, res: EResponse, next: NextFunction) => {
      try {
        const request = new Request(req);
        const response = new Response(res);

        const token = await this.server.authenticate(
          request,
          response,
          options
        );
        res.locals.oauth = { token };
        next();
      } catch (error) {
        this.handleError(error, res);
      }
    };
  }

  public token(options?: TokenOptions) {
    return async (req: ERequest, res: EResponse, next: NextFunction) => {
      try {
        const request = new Request(req);
        const response = new Response(res);

        const token = await this.server.token(request, response, options);
        res.locals.oauth = { token };

        if (this.continueMiddleware?.token) {
          return next();
        }

        this.handleResponse(req, res, response);
      } catch (error) {
        this.handleError(error, res);
      }
    };
  }

  private handleResponse(req: ERequest, res: EResponse, response: Response) {
    if (response.status === 302 && response?.headers?.location) {
      const { location, ...headers } = response.headers;

      res.set(headers);
      res.redirect(location);
    } else {
      res.set(response.headers);
      res.status(response?.status ?? 200).send(response.body);
    }
  }

  private handleError(error: any, res: EResponse) {
    const errorNames = [
      'unsupported_response_type',
      'unsupported_grant_type',
      'unauthorized_request',
      'unauthorized_client',
      'insufficient_scope',
      'invalid_argument',
      'invalid_request',
      'invalid_client',
      'invalid_grant',
      'invalid_scope',
      'invalid_token',
      'access_denied',
      'server_error'
    ];

    const INTERNAL_MESSAGE = 'Internal Server Error';
    const INTERNAL_STATUS = 500;

    let message = INTERNAL_MESSAGE;
    let status = INTERNAL_STATUS;

    if (errorNames.includes(error?.name)) {
      message = error?.message ?? message;
      status = error?.code ?? status;
    }

    return res.status(status >= 500 ? INTERNAL_STATUS : status).json({
      success: false,
      message: status >= 500 ? INTERNAL_MESSAGE : message
    });
  }
}
