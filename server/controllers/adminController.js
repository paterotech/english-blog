import jwt from 'jsonwebtoken';
import Blog from '../models/Blog.js';

export const adminLogin = async(req, res) => {
    try {
        const { email, password } = req.body;
        if(email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ success: true, token });

    }catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }   
}

export const getAllBlogsAdmin = async (req, res)=>{
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        res.json({ success: true, blogs });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const getDashboard = async(req, res)=>{
    try {
        const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
        const blogs = await Blog.countDocuments();
        const drafts = await Blog.countDocuments({ isPublished: false });

        const dashboardData = {
            blogs, recentBlogs, drafts
        }
        res.json({ success: true, dashboardData });
        
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}