const Blogs = require('../models/Blogs.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const gemini = process.env.GOOGLE_API;
exports.fetchBlogs = async(req, res)=>{
    try{
        const tpc = req.params.topic;
        
        const blog = await Blogs.findOne({
            slug: tpc
        });
        return res.status(200).json({
            success: true,
            data: blog
        })
    } catch(err){
        return res.status(200).json({
            success: true,
            message: 'something went wrong'
        })
    }
}
exports.fetchAllBlogs = async(req, res)=>{
    try{
        const blogs = await Blogs.find();
        return res.status(200).json({
            success: true,
            data: blogs
        })
    } catch(err){
        return res.status(200).json({
            success: false,
            message: 'something went wrong'
        })
    }
}
exports.fetchBlogsByTopics = async(req, res)=>{
    try{
        const {topics} = req.body;
        const blogs = await Blogs.find({
            topic: {
                $in: topics
            }
        });
        return res.status(200).json({
            success: true,
            data: blogs
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}
exports.clearDoubt = async(req, res)=>{
    try{
        const genAI = new GoogleGenerativeAI(`${gemini}`);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const {blogContent, doubt} = req.body;
        const prompt = `You are an AI assistant. Answer the user's query based on the following blog content:\n\n"${blogContent}"\n\nUser is asking:\n\n${doubt}\n\nIf the query is unrelated to the blog content, politely inform the user that you can only answer questions based on the given content.`;
        const result = await model.generateContent(prompt);
        return res.status(200).json({
            success: true,
            data: result.response.text()
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Something Went Wrong'
        })
    }
}