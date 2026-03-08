import { Router } from 'express';
import { createJournalEntry, listEntries, getEntry } from '../controllers/journalController';
import { upload } from '../utils/multerConfig';

const router = Router();

// Route for creating a journal entry with audio upload
router.post('/', upload.single('audioFile'), createJournalEntry);

// Route for listing all journal entries
router.get('/', listEntries);

// Route for getting a single entry by ID
router.get('/:id', getEntry);

export default router;
