import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface Summary {
    highlights: string[];
    lessons: string[];
    improvements: string[];
    nextActions: string[];
}

export const generateSummary = async (transcript: string): Promise<Summary> => {
    const prompt = `
Convert the following daily reflection into structured insights.
Return JSON with this format:
{
  "highlights": [],
  "lessons": [],
  "improvements": [],
  "nextActions": []
}
Rules:
Highlights:
Important events or achievements of the day.
Lessons:
Things learned or realizations.
Improvements:
What the person could do better tomorrow.
NextActions:
Concrete actions for the next day.
Keep items short bullet points.
Reflection:
${transcript}
Ensure the response is valid JSON.
  `;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a helpful assistant that analyzes daily reflections.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error('No content returned from AI service.');

        return JSON.parse(content) as Summary;
    } catch (error: any) {
        console.error('AI Summary Error:', error.message);
        throw new Error('Failed to generate summary.');
    }
};
