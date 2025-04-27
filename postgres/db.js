const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true, // Ensure SSL is used
        rejectUnauthorized: false, // Accept self-signed certificates
      },
      connectTimeout: 10000,  // 10 seconds timeout for the connection
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 60000,  // Allow up to 60 seconds to acquire a connection
      idle: 10000,     // Allow up to 10 seconds of idle time before closing the connection
    },
  }
);

sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected successfully!"))
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);  // Exit the application if the connection fails
  });

module.exports = sequelize;
