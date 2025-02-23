import { useState, useEffect } from "react";

const useSummaryAndFeedback = (transcript) => {
  const [chatFeedback, setChatFeedback] = useState({
    summary: "",
    feedback: "",
    score: null,
  });
  const userId = localStorage.getItem("userId");

  const generateSummaryAndFeedback = async () => {
    if (!transcript || transcript.length === 0) return;

    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API;

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: `You are a medical examiner. Analyze the following consultation transcript and return a structured JSON response with the following format:

            {
              "summary": "Concise summary of the conversation",
              "feedback": "Detailed constructive feedback",
              "score": 7
            }

            Follow UK consultation guidelines and focus on:
            - Introduction and empathy
            - Safety-netting
            - Red flag symptoms
            - Past medical and surgical history
            - Ideas, concerns, and expectations
            - Family and social history
            - Overall consultation style.

            Ensure the response is strictly formatted as JSON without additional text.`,
              },
              {
                role: "user",
                content: `Transcript:\n${transcript
                  .map(
                    (entry) =>
                      `${entry.fromAI ? "Patient" : "Doctor"}: ${entry.text}`,
                  )
                  .join("\n")}`,
              },
            ],
          }),
        },
      );

      const data = await response.json();

      // Parse the JSON content from OpenAI response
      const result = JSON.parse(data.choices[0].message.content);
      setChatFeedback({
        summary: result.summary,
        feedback: result.feedback,
        score: result.score,
        user_id: userId,
      });

      return result;
    } catch (error) {
      console.error("Error generating summary and feedback:", error);
      return null;
    }
  };

  return { chatFeedback, generateSummaryAndFeedback };
};

export default useSummaryAndFeedback;
