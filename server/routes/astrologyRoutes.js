const express = require('express');
const router = express.Router();

// Controllers Import
const { 
    getHoroscope, 
    calculateRashi, 
    calculateKundliMatch, 
    checkCompatibility, 
    calculateLove, 
    calculateNumerology ,
      calculateNameRashi
} = require('../controllers/astrologyController');

// ==========================================
// 🔮 ASTROLOGY & CALCULATORS ROUTES
// ==========================================
// Ye routes public hain (bina login ke bhi accessible hain)
// Taaki koi bhi user free tools use kar sake.

// 1. Horoscope (Daily, Weekly, Monthly, Yearly)
router.post('/horoscope', getHoroscope);

// 2. Rashi & Nakshatra Calculator
router.post('/rashi', calculateRashi);

// 3. Kundli Matching (Guna Milan)
router.post('/kundli-match', calculateKundliMatch);
router.post('/name-rashi', calculateNameRashi);
// 4. Love Compatibility
router.post('/compatibility', checkCompatibility);

// 5. Love Calculator
router.post('/love', calculateLove);

// 6. Numerology Calculator
router.post('/numerology', calculateNumerology);

module.exports = router;