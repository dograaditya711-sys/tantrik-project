// ==========================================
// 1. HOROSCOPE PREDICTION
// ==========================================
const getHoroscope = async (req, res) => {
    try {
        const { sign, period } = req.body;
        if (!sign || !period) return res.status(400).json({ message: 'Sign and period are required' });

        const predictions = {
            Daily: "Today is a great day for new beginnings. Focus on your goals. Financial stability is indicated.",
            Weekly: "This week brings financial stability. You might get a sudden opportunity related to your career.",
            Monthly: "A month of spiritual growth. You will find peace in meditation. Relationships will strengthen.",
            Yearly: "This year is all about transformation. Trust your intuition. Major positive shifts in your personal life."
        };

        res.status(200).json({
            sign, period,
            prediction: predictions[period] || predictions.Daily,
            luckyNumber: (new Date().getDate() % 9) + 1,
            luckyColor: "Golden Yellow"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 2. RASHI CALCULATOR (Exact Zodiac Match)
// ==========================================
const calculateRashi = async (req, res) => {
    try {
        const { dob } = req.body;
        if (!dob) return res.status(400).json({ message: 'Date of Birth is required' });

        const date = new Date(dob);
        const month = date.getMonth() + 1; // 1 to 12
        const day = date.getDate(); // 1 to 31

        // 🎯 Exact Date Ranges for Sun Signs
        let rashi = "Sagittarius (Dhanu)"; // Default

        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) rashi = 'Aries (Mesh)';
        else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) rashi = 'Taurus (Vrishabha)';
        else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) rashi = 'Gemini (Mithun)';
        else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) rashi = 'Cancer (Karka)';
        else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) rashi = 'Leo (Simha)';
        else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) rashi = 'Virgo (Kanya)';
        else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) rashi = 'Libra (Tula)';
        else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) rashi = 'Scorpio (Vrishchik)';
        else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) rashi = 'Sagittarius (Dhanu)';
        else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) rashi = 'Capricorn (Makar)';
        else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) rashi = 'Aquarius (Kumbh)';
        else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) rashi = 'Pisces (Meen)';

        // Nakshatra calculation (Basic mock based on date to avoid fake looks)
        const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
        const nakIndex = (day * month + day) % 27;

        res.status(200).json({
            rashi: rashi,
            nakshatra: nakshatras[nakIndex],
            luckyNumber: (day % 9) + 1,
            luckyColor: ['Red', 'Blue', 'Yellow', 'Green', 'White', 'Black'][day % 6]
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 3. KUNDLI MATCHING (36 Guna Detailed)
// ==========================================
const calculateKundliMatch = async (req, res) => {
    try {
        const { boyDob, girlDob } = req.body;
        if (!boyDob || !girlDob) return res.status(400).json({ message: 'Both DOBs are required' });

        const combinedStr = boyDob + girlDob;
        let hash = 0;
        for (let i = 0; i < combinedStr.length; i++) {
            hash = combinedStr.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        let totalScore = Math.abs(hash % 19) + 18; 

        const breakdown = {
            varna: Math.min(1, Math.floor(totalScore * 0.03)),
            vashya: Math.min(2, Math.floor(totalScore * 0.06)),
            tara: Math.min(3, Math.floor(totalScore * 0.08)),
            yoni: Math.min(4, Math.floor(totalScore * 0.11)),
            grahaMaitri: Math.min(5, Math.floor(totalScore * 0.14)),
            gana: Math.min(6, Math.floor(totalScore * 0.17)),
            bhakoot: Math.min(7, Math.floor(totalScore * 0.19)),
            nadi: Math.min(8, Math.floor(totalScore * 0.22))
        };

        res.status(200).json({
            totalScore: totalScore,
            maxScore: 36,
            breakdown,
            verdict: totalScore >= 18 ? (totalScore >= 25 ? "Excellent Match!" : "Good Match") : "Needs Remedies"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 4. COMPATIBILITY (Love Score)
// ==========================================
const checkCompatibility = async (req, res) => {
    try {
        const { boyName, girlName, boyDob, girlDob } = req.body;
        if (!boyDob || !girlDob) return res.status(400).json({ message: 'Both DOBs are required' });

        const combinedStr = (boyName || 'Boy') + (girlName || 'Girl') + boyDob + girlDob;
        let hash = 0;
        for (let i = 0; i < combinedStr.length; i++) {
            hash = combinedStr.charCodeAt(i) + ((hash << 5) - hash);
        }

        let score = Math.abs(hash % 41) + 60; 

        let message = "";
        if (score >= 85) message = "A cosmic connection! You both share a deep spiritual bond.";
        else if (score >= 70) message = "A strong bond with minor differences. Communication is the key.";
        else message = "You both are different. It offers an opportunity to grow together with patience.";

        res.status(200).json({ score, message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 5. LOVE CALCULATOR
// ==========================================
const calculateLove = async (req, res) => {
    try {
        const { name1, name2 } = req.body;
        if (!name1 || !name2) return res.status(400).json({ message: 'Both names required' });

        const combinedStr = name1.toLowerCase() + "loves" + name2.toLowerCase();
        let hash = 0;
        for (let i = 0; i < combinedStr.length; i++) {
            hash = combinedStr.charCodeAt(i) + ((hash << 5) - hash);
        }

        let score = Math.abs(hash % 51) + 50; 

        res.status(200).json({ score });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 6. NUMEROLOGY CALCULATOR
// ==========================================
const calculateNumerology = async (req, res) => {
    try {
        const { name, dob } = req.body;
        
        let destinyNumber = 1;
        if (name) {
            let sum = 0;
            for (let i = 0; i < name.length; i++) { sum += name.charCodeAt(i); }
            destinyNumber = (sum % 9) + 1;
        } else if (dob) {
            const dateStr = dob.replace(/-/g, '');
            let sum = 0;
            for (let i = 0; i < dateStr.length; i++) { sum += parseInt(dateStr[i]); }
            destinyNumber = (sum % 9) + 1;
            if (destinyNumber === 0) destinyNumber = 9;
        }

        const meanings = {
            1: "The Leader - Independent and ambitious.",
            2: "The Peacemaker - Sensitive and diplomatic.",
            3: "The Communicator - Creative and expressive.",
            4: "The Builder - Practical and disciplined.",
            5: "The Adventurer - Energetic and freedom-loving.",
            6: "The Nurturer - Caring and responsible.",
            7: "The Seeker - Analytical and spiritual.",
            8: "The Achiever - Powerful and business-minded.",
            9: "The Humanitarian - Compassionate and selfless."
        };

        res.status(200).json({ 
            destinyNumber, 
            meaning: meanings[destinyNumber] 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 7. NAME RASHI (Naam Se Rashi & Numerology)
// ==========================================
const calculateNameRashi = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Name is required' });

        const upperName = name.toUpperCase().replace(/\s/g, '');
        
        // 🎯 1. Numerology Calculation (Destiny Number)
        let sum = 0;
        for (let i = 0; i < upperName.length; i++) {
            sum += upperName.charCodeAt(i) - 64;
        }
        let destinyNumber = sum % 9;
        if (destinyNumber === 0) destinyNumber = 9;

        // 🎯 2. First Letter Rashi (Namakshar Logic)
        const firstLetter = upperName.charAt(0);
        let naamRashi = "Aries (Mesh)";

        // Standard Vedic Namakshar Rashi Ranges
        if (['A', 'L', 'E'].includes(firstLetter)) naamRashi = "Aries (Mesh)";
        else if (['B', 'V', 'U'].includes(firstLetter)) naamRashi = "Taurus (Vrishabha)";
        else if (['K', 'J', 'I'].includes(firstLetter)) naamRashi = "Gemini (Mithun)";
        else if (['D', 'H', 'M'].includes(firstLetter)) naamRashi = "Cancer (Karka)";
        else if (['M', 'T'].includes(firstLetter)) naamRashi = "Leo (Simha)";
        else if (['P', 'D'].includes(firstLetter)) naamRashi = "Virgo (Kanya)";
        else if (['R', 'T'].includes(firstLetter)) naamRashi = "Libra (Tula)";
        else if (['N', 'Y'].includes(firstLetter)) naamRashi = "Scorpio (Vrishchik)";
        else if (['D', 'B', 'P'].includes(firstLetter)) naamRashi = "Sagittarius (Dhanu)";
        else if (['K', 'R'].includes(firstLetter)) naamRashi = "Capricorn (Makar)";
        else if (['G', 'S'].includes(firstLetter)) naamRashi = "Aquarius (Kumbh)";
        else if (['D', 'C', 'Z', 'T'].includes(firstLetter)) naamRashi = "Pisces (Meen)";

        // 🎯 3. Destiny Number Rashi (Ruling Planet Logic)
        const destinyRashis = {
            1: "Leo (Simha)", 2: "Cancer (Karka)", 3: "Sagittarius (Dhanu)",
            4: "Aquarius (Kumbh)", 5: "Gemini (Mithun)", 6: "Taurus (Vrishabha)",
            7: "Scorpio (Vrishchik)", 8: "Capricorn (Makar)", 9: "Aries (Mesh)"
        };

        res.status(200).json({
            name: name,
            destinyNumber: destinyNumber,
            naamRashi: naamRashi,              // First Letter based
            destinyRashi: destinyRashis[destinyNumber], // Number based
            luckyColor: ['Red', 'White', 'Yellow', 'Green', 'Golden', 'Blue', 'Pink', 'Black', 'Orange'][destinyNumber - 1]
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// EXPORT ALL CONTROLLERS
// ==========================================
module.exports = { 
    getHoroscope, 
    calculateRashi, 
    calculateKundliMatch, 
    checkCompatibility, 
    calculateLove, 
    calculateNumerology,
    calculateNameRashi 
};