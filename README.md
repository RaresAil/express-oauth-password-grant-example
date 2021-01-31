# ADR Express TypeScript

- [Documentation](https://raresail.github.io/adr-express-ts/)
- [GitHub](https://github.com/RaresAil/adr-express-ts)
- [NPM](https://www.npmjs.com/package/adr-express-ts)

## OAuth2 Password Grant Example

- Dependencies

  - cookie-parser
  - jsonwebtoken
  - mongoose
  - oauth2-server
  - dotenv

- Files

  - actions/v1/OAuthAction.ts
  - actions/v1/ProtectedAction.ts
  - auth/\* .......... // Directory
  - domain/entities/OAuthClientEntity.ts
  - domain/entities/OAuthTokenEntity.ts
  - middlewares/OAuthLoginMiddleware.ts
  - middlewares/OAuthRestrictMiddleware.ts
  - responders/OAuthResponder.ts
  - index.ts
