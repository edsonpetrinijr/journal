"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSummary = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const generateSummary = async (transcript) => {
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
        if (!content)
            throw new Error('No content returned from AI service.');
        return JSON.parse(content);
    }
    catch (error) {
        console.error('AI Summary Error:', error.message);
        throw new Error('Failed to generate summary.');
    }
};
exports.generateSummary = generateSummary;
