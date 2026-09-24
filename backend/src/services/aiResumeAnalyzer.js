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
    // Production: use Gemini API
    if (process.env.GEMINI_API_KEY) {
      const maxAttempts = 3;
      let lastError;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": process.env.GEMINI_API_KEY,
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: prompt,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  responseMimeType: "application/json",
                  responseSchema: {
                    type: "OBJECT",
                    properties: {
                      strengths: {
                        type: "ARRAY",
                        items: {
                          type: "STRING",
                        },
                      },
                      weaknesses: {
                        type: "ARRAY",
                        items: {
                          type: "STRING",
                        },
                      },
                      suggestions: {
                        type: "ARRAY",
                        items: {
                          type: "STRING",
                        },
                      },
                    },
                    required: ["strengths", "weaknesses", "suggestions"],
                  },
                },
              }),
            },
          );

          if (!response.ok) {
            const errorText = await response.text();

            // Retry temporary Gemini errors
            if (
              (response.status === 503 || response.status === 429) &&
              attempt < maxAttempts
            ) {
              console.log(
                `Gemini temporarily unavailable. Retrying... (${attempt}/${maxAttempts})`,
              );

              await new Promise((resolve) =>
                setTimeout(resolve, attempt * 2000),
              );

              continue;
            }

            throw new Error(
              `Gemini request failed: ${response.status} ${errorText}`,
            );
          }

          const data = await response.json();

          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!generatedText || !generatedText.trim()) {
            throw new Error("Gemini returned an empty response");
          }

          return JSON.parse(generatedText);
        } catch (error) {
          lastError = error;

          if (attempt < maxAttempts) {
            console.log(
              `Gemini request attempt ${attempt} failed. Retrying...`,
            );

            await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
          }
        }
      }

      throw lastError;
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
    throw error;
  }
};

module.exports = {
  analyzeResumeWithAI,
};
