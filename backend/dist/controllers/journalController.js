"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntry = exports.listEntries = exports.createJournalEntry = void 0;
const transcriptionService_1 = require("../services/transcriptionService");
const aiSummaryService_1 = require("../services/aiSummaryService");
const journalService = __importStar(require("../services/journalService"));
const createJournalEntry = async (req, res) => {
    try {
        const { mood, sleepHours, energy, gym, reading, prayer, deepWork } = req.body;
        const audioFile = req.file;
        if (!audioFile) {
            return res.status(400).json({ error: 'Audio file is required.' });
        }
        // Capture the audio path
        const audioPath = audioFile.path;
        // Transcribe audio using Whisper
        const transcript = await (0, transcriptionService_1.transcribeAudio)(audioPath);
        // Generate AI Summary
        const summaryData = await (0, aiSummaryService_1.generateSummary)(transcript);
        // Prepare data for the database
        const entryData = {
            audioPath,
            transcript,
            mood: parseInt(mood, 10),
            sleepHours: parseFloat(sleepHours),
            energy: parseInt(energy, 10),
            gym: gym === 'true',
            reading: reading === 'true',
            prayer: prayer === 'true',
            deepWork: deepWork === 'true',
            summaryData
        };
        // Save records to database
        const entryDetails = await journalService.createEntry(entryData);
        return res.status(201).json(entryDetails);
    }
    catch (error) {
        console.error('Error creating journal entry:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.createJournalEntry = createJournalEntry;
const listEntries = async (req, res) => {
    try {
        const entries = await journalService.getAllEntries();
        return res.json(entries);
    }
    catch (error) {
        console.error('Error fetching journal entries:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.listEntries = listEntries;
const getEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const entry = await journalService.getEntryById(id);
        if (!entry) {
            return res.status(404).json({ error: 'Entry not found.' });
        }
        return res.json(entry);
    }
    catch (error) {
        console.error('Error fetching journal entry:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getEntry = getEntry;
