const express = require('express');
const router = express.Router();
const {fetchBlogs, clearDoubt, fetchBlogsByTopics} = require('../controllers/blogs.js');
router.get('/fetch/:topic', fetchBlogs);
router.post('/askEcho', clearDoubt);
router.post('/fetchBlogs', fetchBlogsByTopics);
module.exports = router;