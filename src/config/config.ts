import * as dotenv from "dotenv";
import * as path from "path";
import * as Joi from "joi";

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(3000),
    MYSQL_HOST: Joi.string().required().description("Mysql connection Host"),
    MYSQL_PORT: Joi.number().default(3306),
    MYSQL_USER: Joi.string().default("root").required(),
    MYSQL_PASSWORD: Joi.string().required(),
    DATABASE_SCHEMA: Joi.string(),
    REDIS_HOST: Joi.string().required().description("Redis connection Host"),
    REDIS_PORT: Joi.number().default(6379),
    REDIS_PASSWORD: Joi.string().default(""),
    PRIMARY_PRIVATE_KEY: Joi.string().required(),
    PRIVATE_KEY: Joi.string().required()
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error != null) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
  env: envVars.NODE_ENV,
  port: envVars.APP_PORT,
  mysql: {
    host: envVars.MYSQL_HOST,
    port: envVars.MYSQL_PORT,
    user: envVars.MYSQL_USER,
    password: envVars.MYSQL_PASSWORD,
    schema: envVars.DATABASE_SCHEMA,
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    password: envVars.REDIS_PASSWORD,
    db: 0,
  },
  wallet: {
    primaryKey: envVars.PRIMARY_PRIVATE_KEY,
  },
  key: {
    privateKey: envVars.PRIVATE_KEY
  }
};
