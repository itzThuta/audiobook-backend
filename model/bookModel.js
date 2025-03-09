const { DataTypes } = require('sequelize');
const sequelize = require('../postgres/db');

const Book = sequelize.define('Books', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  categories: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  book_cover: {
    type: DataTypes.STRING, // URL of the book cover
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  youtubeURL: {
    type: DataTypes.STRING,
    field: 'youtubeurl',
  },
}, {
  timestamps: true,  // Automatically adds createdAt & updatedAt
  underscored: true, // This makes sure sequelize uses snake_case columns like created_at and updated_at
});

module.exports = Book;
