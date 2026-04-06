const { translate } = require('@vitalets/google-translate-api');

async function translateText(text, sourceLang, targetLang) {
  try {
    if (!text || text.trim() === "") return text;

    let source = sourceLang === "auto" ? "en" : sourceLang;
    let target = targetLang || "en";

    if (source === target) return text;

    console.log("🌍 Translating:", source, "→", target);

    const res = await translate(text, {
      from: source,
      to: target
    });

    return res.text;

  } catch (err) {
    console.error("🔥 Google Translate Error:", err.message);
    return text;
  }
}

module.exports = { translateText };