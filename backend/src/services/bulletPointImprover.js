const improveBulletPoint = async (bulletPoint) => {
  const prompt = `
You are a resume bullet point editor.

Your task is to rewrite the user's resume bullet point professionally.

Original bullet point:
${bulletPoint}

STRICT RULES:
1. Return ONLY ONE rewritten resume bullet point.
2. Do NOT provide explanations.
3. Do NOT describe what you changed.
4. Do NOT use phrases like "Here's the improved bullet point".
5. Do NOT add notes, comments, or alternatives.
6. Keep the exact original meaning.
7. Do NOT invent technologies, tools, numbers, achievements, results, or responsibilities.
8. Only use technologies and facts explicitly mentioned in the original bullet point.
9. Use a strong professional action verb where appropriate.
10. Keep the bullet concise.
11. Return plain text only.
`;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2:3b",
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.status}`);
    }

    const data = await response.json();

    let improvedBullet = data.response.trim();

    // Remove quotation marks if the model adds them
    improvedBullet = improvedBullet.replace(/^["']|["']$/g, "");

    return improvedBullet;
  } catch (error) {
    console.error("Bullet point improvement failed:", error.message);

    throw error;
  }
};

module.exports = {
  improveBulletPoint,
};
