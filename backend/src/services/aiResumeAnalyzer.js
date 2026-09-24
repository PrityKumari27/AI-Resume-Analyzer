const analyzeResumeWithAI = async (resumeText) => {
  const prompt = `
You are an AI resume reviewer.

Analyze the following resume and provide practical feedback for a software engineering candidate.

Resume:
${resumeText}

Return the response as JSON in exactly this format:

{
  "strengths": [
    "strength 1",
    "strength 2",
    "strength 3"
  ],
  "weaknesses": [
    "weakness 1",
    "weakness 2",
    "weakness 3"
  ],
  "suggestions": [
    "suggestion 1",
    "suggestion 2",
    "suggestion 3"
  ]
}

Rules:
- Focus only on information present in the resume.
- Do not invent skills, experience, projects, or achievements.
- Keep the feedback specific and practical.
- Suggestions should be useful for software engineering roles.
- Return only valid JSON.
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
            model: "google/gemma-4-31b-it:free",
            models: [
              "google/gemma-4-31b-it:free",
              "qwen/qwen3.8-27b:free",
              "openrouter/free",
            ],
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            response_format: {
              type: "json_object",
            },
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

      const generatedText = data.choices?.[0]?.message?.content;

      if (!generatedText) {
        throw new Error("OpenRouter returned an empty response");
      }

      return JSON.parse(generatedText);
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
        format: "json",
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.status}`);
    }

    const data = await response.json();

    return JSON.parse(data.response);
  } catch (error) {
    console.error("AI resume analysis failed:", error.message);
    console.error("Error cause:", error.cause);
    console.error("Error stack:", error.stack);
    throw error;
  }
};

module.exports = {
  analyzeResumeWithAI,
};
