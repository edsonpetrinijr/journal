import { Request, Response } from 'express';
import { transcribeAudio } from '../services/transcriptionService';
import { generateSummary } from '../services/aiSummaryService';
import * as journalService from '../services/journalService';
import path from 'path';

export const createJournalEntry = async (req: Request, res: Response) => {
    try {
        const { mood, sleepHours, energy, gym, reading, prayer, deepWork } = req.body;
        const audioFile = req.file;

        if (!audioFile) {
            return res.status(400).json({ error: 'Audio file is required.' });
        }

        // Capture the audio path
        const audioPath = audioFile.path;

        // Transcribe audio using Whisper
        const transcript = await transcribeAudio(audioPath);

        // Generate AI Summary
        const summaryData = await generateSummary(transcript);

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
    } catch (error: any) {
        console.error('Error creating journal entry:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const listEntries = async (req: Request, res: Response) => {
    try {
        const entries = await journalService.getAllEntries();
        return res.json(entries);
    } catch (error: any) {
        console.error('Error fetching journal entries:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getEntry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const entry = await journalService.getEntryById(id);

        if (!entry) {
            return res.status(404).json({ error: 'Entry not found.' });
        }

        return res.json(entry);
    } catch (error: any) {
        console.error('Error fetching journal entry:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
