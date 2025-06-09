const { Sequelize } = require("sequelize");
require("dotenv").config();

const useSSL = false; // ✅ Local မှာ SSL မလိုတော့

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ...(useSSL && {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }),
      useIPv6: false, // ✅ Prevent Render from using IPv6
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Test DB connection
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected successfully!"))
  .catch((error) => {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  });

module.exports = sequelize;
