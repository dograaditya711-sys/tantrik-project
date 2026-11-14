const Blog = require('../models/Blog');
const ConsultationCategory = require('../models/ConsultationCategory');
const Coupon = require('../models/Coupon');

// ==========================================
// --- BLOG CRUD ---
// ==========================================
const addBlog = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        
        let imageUrl = '';
        if (req.file) {
            // 🎯 H4 Fix: Cloudinary URL
            imageUrl = req.file.path;
        }

        const blog = await Blog.create({
            title, content, tags: tags ? tags.split(',').map(tag => tag.trim()) : [], image: imageUrl, isPublished: true
        });
        res.status(201).json({ message: 'Blog added successfully', blog });
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
};

const getAllBlogs = async (req, res) => {
    try {
        // 🎯 Newest blogs pehle dikhein (sort added)
        const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
};

// ==========================================
// --- CATEGORY CRUD (Browse by Category) ---
// ==========================================
const addCategory = async (req, res) => {
    try {
        const category = await ConsultationCategory.create(req.body);
        res.status(201).json(category);
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await ConsultationCategory.find({ isActive: true });
        res.status(200).json(categories);
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
};

// ==========================================
// --- COUPON CRUD ---
// ==========================================
const addCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json(coupon);
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
};

const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({});
        res.status(200).json(coupons);
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
};
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    addBlog, getAllBlogs, getBlogById,
    addCategory, getAllCategories,  
    addCoupon, getAllCoupons 
};