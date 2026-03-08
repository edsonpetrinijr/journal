"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const journalController_1 = require("../controllers/journalController");
const multerConfig_1 = require("../utils/multerConfig");
const router = (0, express_1.Router)();
// Route for creating a journal entry with audio upload
router.post('/', multerConfig_1.upload.single('audioFile'), journalController_1.createJournalEntry);
// Route for listing all journal entries
router.get('/', journalController_1.listEntries);
// Route for getting a single entry by ID
router.get('/:id', journalController_1.getEntry);
exports.default = router;
