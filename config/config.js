require("dotenv").config()
module.exports = {
  development: {
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: "jolly_dev",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: "jolly_test",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  preparing: {
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: "jolly_preparing",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
}
