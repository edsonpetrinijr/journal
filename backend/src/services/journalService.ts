import { PrismaClient } from '@prisma/client';
import { Summary } from './aiSummaryService';

const prisma = new PrismaClient();

export interface CreateJournalEntryData {
    audioPath: string;
    transcript: string;
    mood: number;
    sleepHours: number;
    energy: number;
    gym: boolean;
    reading: boolean;
    prayer: boolean;
    deepWork: boolean;
    summaryData: Summary;
}

export const createEntry = async (data: CreateJournalEntryData) => {
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

export const getAllEntries = async () => {
    return await prisma.journalEntry.findMany({
        orderBy: {
            date: 'desc'
        },
        include: {
            summary: true
        }
    });
};

export const getEntryById = async (id: string) => {
    return await prisma.journalEntry.findUnique({
        where: { id },
        include: {
            summary: true
        }
    });
};
