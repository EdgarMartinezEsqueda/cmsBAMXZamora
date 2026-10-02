/** @import { Core } from '@strapi/strapi' */

const { isDatabaseClientKind } = require('@strapi/database');

module.exports = ({ env }) => {
  // El proyecto usa MySQL. SQLite se retiro a proposito: no volver a agregarlo.
  const client = env('DATABASE_CLIENT', 'mysql');

  if (!isDatabaseClientKind(client)) {
    throw new Error(`Unsupported DATABASE_CLIENT: ${client}. Use "mysql" or "postgres".`);
  }

  /** @type {Partial<Record<Core.Config.Database.ClientKind, Core.Config.Database['connection']>>} */
  const connections = {
    mysql: {
      client: 'mysql',
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
      },
      // min 0: MySQL (wait_timeout) o la red cierran las conexiones inactivas; si el pool
      // las retiene, la primera consulta tras un rato sin tráfico falla. Se liberan a los 30 s.
      pool: {
        min: env.int('DATABASE_POOL_MIN', 0),
        max: env.int('DATABASE_POOL_MAX', 10),
        idleTimeoutMillis: env.int('DATABASE_POOL_IDLE_TIMEOUT', 30000),
      },
    },
    postgres: {
      client: 'postgres',
      connection: {
        connectionString: env('DATABASE_URL'),
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
        schema: env('DATABASE_SCHEMA', 'public'),
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    },
  };

  if (!connections[client]) {
    throw new Error(`DATABASE_CLIENT "${client}" no esta configurado. Este proyecto usa MySQL.`);
  }

  return {
    connection: {
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
