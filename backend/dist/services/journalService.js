"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntryById = exports.getAllEntries = exports.createEntry = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createEntry = async (data) => {
    const { summaryData, ...entryData } = data;
    return await prisma.$transaction(async (tx) => {
        const entry = await tx.journalEntry.create({
            data: {
                ...entryData,
                summary: {
                    create: {
                        highlights: JSON.stringify(summaryData.highlights),
                        lessons: JSON.stringify(summaryData.lessons),
                        improvements: JSON.stringify(summaryData.improvements),
                        nextActions: JSON.stringify(summaryData.nextActions),
                    }
                }
            },
            include: {
                summary: true
            }
        });
        return entry;
    });
};
exports.createEntry = createEntry;
const getAllEntries = async () => {
    return await prisma.journalEntry.findMany({
        orderBy: {
            date: 'desc'
        },
        include: {
            summary: true
        }
    });
};
exports.getAllEntries = getAllEntries;
const getEntryById = async (id) => {
    return await prisma.journalEntry.findUnique({
        where: { id },
        include: {
            summary: true
        }
    });
};
exports.getEntryById = getEntryById;
