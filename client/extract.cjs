const fs = require('fs');
const path = require('path');

async function downloadAndExtract() {
    console.log("⏳ Downloading source code from ThreeUI...");
    try {
        // Direct URL se data fetch kar rahe hain
        const response = await fetch('https://threeui.com/source-code/temple-night.json');
        const jsonData = await response.json();

        const targetDir = path.join(__dirname, 'src', 'components', 'temple-night');
        
        // Agar folder nahi hai toh banao
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Har file ko nikal kar save karo
        jsonData.files.forEach(file => {
            let filename = path.basename(file.path);
            
            // TSX ko JSX banayenge taaki JS project mein error na aaye
            if (filename.endsWith('.tsx')) {
                filename = 'TempleNightScene.jsx';
            }

            const filePath = path.join(targetDir, filename);
            fs.writeFileSync(filePath, file.code, 'utf-8');
            console.log(`✅ Perfect code saved: ${filename}`);
        });

        console.log("🎉 All files generated successfully! Now run 'npm run dev'");
    } catch (error) {
        console.error("❌ Error downloading:", error.message);
    }
}

downloadAndExtract();