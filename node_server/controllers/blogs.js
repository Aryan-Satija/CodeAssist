const Blogs = require('../models/Blogs.js');
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