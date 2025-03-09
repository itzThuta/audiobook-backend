const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../postgres/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // Default role (e.g., 1 for regular user)
      },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    tableName: 'users', // Explicitly set the table name to match your PSQL table
    timestamps: false, // Disable Sequelize's automatic timestamps
  }
);

User.findByEmail = async (email) => {
  try {
    const user = await User.findOne({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error("Error in findByEmail:", error);
    throw error;
  }
};

// Custom method to find a user by ID
User.findById = async (id) => {
    try {
      const user = await User.findByPk(id); // Use Sequelize's findByPk internally
      return user;
    } catch (error) {
      console.error("Error in findById:", error);
      throw error;
    }
  }

module.exports = User;