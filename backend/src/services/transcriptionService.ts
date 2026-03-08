import OpenAI from 'openai';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const transcribeAudio = async (filePath: string): Promise<string> => {
    try {
        const response = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: 'whisper-1',
        });

        return response.text;
    } catch (error: any) {
        console.error('Transcription Error:', error.message);
        throw new Error('Failed to transcribe audio.');
    }
};
