const Env = Bun.env || process.env;

export default {
  NODE_ENV: Env.NODE_ENV || "dev",
  PORT: Env.PORT || 4000,
  DATABASE_URL: Env.DATABASE_URL || "",
  JWT_SECRET: Env.JWT_SECRET || "",
};
