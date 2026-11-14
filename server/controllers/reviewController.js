const Review = require('../models/Review');
const Tantrik = require('../models/Tantrik');

// @desc    Add Review for a Tantrik
// @route   POST /api/users/review
const addReview = async (req, res) => {
    try {
        const { tantrikId, rating, comment, sessionId } = req.body;

        // 1. Naya review save karein
        const review = await Review.create({
            userId: req.user._id,
            tantrikId,
            rating,
            comment,
            sessionId
        });

        // 2. Tantrik ki average rating calculate karein
        const reviews = await Review.find({ tantrikId });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        // 3. Tantrik model ko update karein
        await Tantrik.findByIdAndUpdate(tantrikId, {
            rating: avgRating.toFixed(1), // 1 decimal place tak
            totalReviews: reviews.length
        });

        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Reviews for a Tantrik
// @route   GET /api/users/reviews/:tantrikId
const getTantrikReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ tantrikId: req.params.tantrikId })
            .populate('userId', 'name profileImage')
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addReview, getTantrikReviews };