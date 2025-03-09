const Book = require('../model/bookModel');

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const { categories, book_cover, title, author, description, youtubeURL } = req.body;
    if (!categories || !title || !author) {
      return res.status(400).json({ error: "Categories, Title, and Author are required" });
    }

    const newBook = await Book.create({ categories, book_cover, title, author, description, youtubeURL });
    res.status(201).json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json({ message: "Books fetched successfully", books });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { categories, book_cover, title, author, description, youtubeURL } = req.body;

    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    await book.update({ categories, book_cover, title, author, description, youtubeURL });
    res.json({ message: "Book updated successfully", book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    await book.destroy();
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
