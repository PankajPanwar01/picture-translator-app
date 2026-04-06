const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');

async function extractTextFromImage(imagePath) {
  try {
    const fullPath = path.resolve(imagePath);

    // ✅ Check file exists
    if (!fs.existsSync(fullPath)) {
      throw new Error("Image file not found: " + fullPath);
    }

    console.log("📸 Processing image:", fullPath);

    const { data } = await Tesseract.recognize(
      fullPath,
      'eng+hin', // 👉 keep stable (add more later)
      {
        logger: m => {
          if (m.status === "recognizing text") {
            console.log(`Progress: ${Math.round(m.progress * 100)}%`);
          }
        },

        // 🔥 IMPORTANT CONFIG FOR BETTER OCR
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
        tessedit_char_whitelist:
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?@#$%&*()-_=+[]{}:;"\'<>/\\|`~ ',

        preserve_interword_spaces: '1'
      }
    );

    let text = data.text || "";

    // ✅ CLEAN TEXT
    text = text
      .replace(/\n+/g, '\n')        // remove extra new lines
      .replace(/[^\x00-\x7F\u0900-\u097F]+/g, '') // keep English + Hindi only
      .trim();

    if (!text) return "No text detected";

    console.log("📝 Extracted Text:", text);

    return text;

  } catch (error) {
    console.error("🔥 OCR ERROR:", error.message);
    throw new Error("OCR failed");
  }
}

module.exports = { extractTextFromImage };