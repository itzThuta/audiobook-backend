const express = require('express');
const { register, login, getProfile, getAllUsers, deleteUser, updateUser } = require('../controller/userController');
const { verifyToken } = require('../middleware/middleware');
const { createBook, getAllBooks, updateBook, deleteBook } = require('../controller/bookController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/delete_users_byID/:id', verifyToken, deleteUser); 
router.put('/update_users_byID/:id', updateUser); 
router.get('/get_all_users', getAllUsers);
router.post('/create_books', createBook);  
router.get('/get_all_books', getAllBooks); 
router.put('/update_books/:id', updateBook); 
router.delete('/delete_books/:id', deleteBook);

module.exports = router;
