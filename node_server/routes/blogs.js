const express = require('express');
const router = express.Router();
const {fetchBlogs, fetchAllBlogs, fetchBlogsByTopics} = require('../controllers/blogs.js');
router.get('/fetch/:topic', fetchBlogs);
// router.get('/fetch', fetchAllBlogs);
router.post('/fetchBlogs', fetchBlogsByTopics);
module.exports = router;