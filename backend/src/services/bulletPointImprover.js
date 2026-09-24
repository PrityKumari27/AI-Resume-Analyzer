const improveBulletPoint = async (bulletPoint) => {
  const prompt = `
You are an expert resume writer.

Improve the following resume bullet point for a software engineering resume.

Original bullet point:
${bulletPoint}

Rules:
- Keep the original meaning.
- Do not invent metrics, technologies, achievements, or responsibilities.
- Make it concise and professional.
- Use a strong action verb.
- Improve clarity and impact.
- Return ONLY the final improved bullet point.
- Do not explain your changes.
- Do not provide notes, reasoning, or commentary.
- Do not use labels such as "Improved bullet point:".
- Output exactly one sentence.
`;

  try {
    // Production: use OpenRouter free models
    if (process.env.OPENROUTER_API_KEY) {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          },
          body: JSON.stringify({
            model: "openrouter/free",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `OpenRouter request failed: ${response.status} ${errorText}`,
        );
      }

      const data = await response.json();

      let improvedBullet = data.choices?.[0]?.message?.content?.trim();

      if (!improvedBullet) {
        throw new Error("OpenRouter returned an empty response");
      }

      // Remove common explanation prefixes
      improvedBullet = improvedBullet
        .replace(/^Improved bullet point:\s*/i, "")
        .trim();

      // Keep only the first paragraph if the model adds extra explanation
      improvedBullet = improvedBullet.split(/\n\s*\n/)[0].trim();

      // Remove surrounding quotes
      if (improvedBullet.startsWith('"') && improvedBullet.endsWith('"')) {
        improvedBullet = improvedBullet.slice(1, -1).trim();
      }

      return improvedBullet;
    }

    // Local development: use Ollama
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

    return data.response.trim();
  } catch (error) {
    console.error("Bullet point improvement failed:", error.message);
    throw error;
  }
};

module.exports = {
  improveBulletPoint,
};
