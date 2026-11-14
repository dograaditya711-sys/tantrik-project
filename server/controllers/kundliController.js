// @desc    Generate Free Kundli
// @route   POST /api/users/generate-kundli
const generateKundli = async (req, res) => {
    try {
        const { name, dob, tob, pob } = req.body;

        if (!name || !dob || !tob || !pob) {
            return res.status(400).json({ message: 'Please provide all details' });
        }

        // 🎯 Mock Astrology Logic (Yahan aap aage real API laga sakte hain)
        const zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
        const nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha"];
        
        // Date ke hisaab se random sign (demo ke liye)
        const date = new Date(dob);
        const sunSignIndex = date.getMonth() % 12;
        const moonSignIndex = (date.getDate()) % 12;
        const nakIndex = date.getDate() % 9;

        const kundliReport = {
            name: name,
            dob: dob,
            tob: tob,
            pob: pob,
            sunSign: zodiacSigns[sunSignIndex],
            moonSign: zodiacSigns[moonSignIndex],
            ascendant: zodiacSigns[(sunSignIndex + 2) % 12],
            nakshatra: nakshatras[nakIndex],
            manglik: date.getDate() % 2 === 0 ? 'Yes' : 'No',
            luckyNumber: (date.getDate() % 9) + 1,
            luckyColor: date.getDate() % 2 === 0 ? 'Red' : 'Blue',
            gemstone: date.getDate() % 2 === 0 ? 'Ruby' : 'Emerald'
        };

        res.status(200).json({ 
            message: 'Kundli generated successfully', 
            report: kundliReport 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { generateKundli };