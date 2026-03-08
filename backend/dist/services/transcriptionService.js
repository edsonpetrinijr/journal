"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transcribeAudio = void 0;
const openai_1 = __importDefault(require("openai"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const transcribeAudio = async (filePath) => {
    try {
        const response = await openai.audio.transcriptions.create({
            file: fs_1.default.createReadStream(filePath),
            model: 'whisper-1',
        });
        return response.text;
    }
    catch (error) {
        console.error('Transcription Error:', error.message);
        throw new Error('Failed to transcribe audio.');
    }
};
exports.transcribeAudio = transcribeAudio;
