const db = require('../../models');
const { ReadingSchedule, LibraryItem, User } = require('../../models');
const { Op } = require('sequelize');

// Helper to calculate end date based on pace
const calculateEndDate = (startDate, totalChapters, chaptersPerReading, readingsPerWeek) => {
    if (!totalChapters || !chaptersPerReading || !readingsPerWeek) return null;

    const totalReadings = Math.ceil(totalChapters / chaptersPerReading);
    const weeksNeeded = totalReadings / readingsPerWeek;
    const daysNeeded = Math.ceil(weeksNeeded * 7);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + daysNeeded);
    return endDate;
};

// Create a new Reading Schedule
exports.createSchedule = async (req, res) => {
    try {
        const {
            scheduleType,
            itemId,
            title,
            bibleBooks,
            bookChapters,
            chaptersPerReading,
            readingsPerWeek,
            startDate
        } = req.body;

        // Validation
        if (!scheduleType || !title || !startDate) {
            return res.status(400).send({ message: "Missing required fields." });
        }

        let totalChapters = 0;

        if (scheduleType === 'Bible') {
            if (!bibleBooks || !Array.isArray(bibleBooks) || bibleBooks.length === 0) {
                return res.status(400).send({ message: "Bible books selection is required." });
            }
            // Calculate total chapters for Bible schedule
            // structure: [{ book: 'Genesis', startChapter: 1, endChapter: 50 }, ...]
            bibleBooks.forEach(b => {
                totalChapters += (b.endChapter - b.startChapter + 1);
            });
        } else if (scheduleType === 'Book') {
            if (!itemId) {
                return res.status(400).send({ message: "Library item ID is required for Book schedules." });
            }
            if (!bookChapters || !bookChapters.endChapter) {
                return res.status(400).send({ message: "Book chapter range is required." });
            }
            // Calculate total chapters
            const start = bookChapters.startChapter || 1;
            totalChapters = bookChapters.endChapter - start + 1;
        }

        const estimatedEndDate = calculateEndDate(startDate, totalChapters, chaptersPerReading, readingsPerWeek);

        const schedule = await ReadingSchedule.create({
            userId: req.user.id, // From middleware
            scheduleType,
            itemId: scheduleType === 'Book' ? itemId : null,
            title,
            bibleBooks: scheduleType === 'Bible' ? bibleBooks : null,
            bookChapters: scheduleType === 'Book' ? bookChapters : null,
            chaptersPerReading,
            readingsPerWeek,
            startDate,
            estimatedEndDate,
            currentChapter: 0,
            totalChapters,
            completed: false
        });

        res.status(201).send(schedule);
    } catch (err) {
        console.error("Error creating schedule:", err);
        res.status(500).send({ message: err.message || "Some error occurred while creating the Reading Schedule." });
    }
};

// Get all schedules for the user
exports.getUserSchedules = async (req, res) => {
    try {
        const schedules = await ReadingSchedule.findAll({
            where: { userId: req.user.id },
            include: [
                { model: LibraryItem, attributes: ['title', 'coverImageUrl'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Calculate progress percentage for each
        const schedulesWithProgress = schedules.map(s => {
            const plain = s.get({ plain: true });
            plain.progressPercentage = s.totalChapters > 0 ? Math.round((s.currentChapter / s.totalChapters) * 100) : 0;
            return plain;
        });

        res.status(200).send(schedulesWithProgress);
    } catch (err) {
        res.status(500).send({ message: err.message || "Error retrieving schedules." });
    }
};

// Get a single schedule by ID
exports.getScheduleById = async (req, res) => {
    try {
        const id = req.params.id;

        const schedule = await ReadingSchedule.findOne({
            where: { scheduleId: id, userId: req.user.id },
            include: [
                { model: LibraryItem, attributes: ['title', 'authors', 'coverImageUrl'] }
            ]
        });

        if (!schedule) {
            return res.status(404).send({ message: "Schedule not found." });
        }

        const plain = schedule.get({ plain: true });

        // Calculate next reading info
        // Logic: 
        // 1. Determine how many chapters left
        // 2. Identify the next chunk to read based on chaptersPerReading
        // 3. For Bible, map this chunk to specific Book + Chapters
        // 4. For Book, map to chapter numbers

        let nextReading = null;
        if (!schedule.completed && schedule.currentChapter < schedule.totalChapters) {
            const chaptersToRead = Math.min(schedule.chaptersPerReading, schedule.totalChapters - schedule.currentChapter);

            let readingDescription = "";

            if (schedule.scheduleType === 'Book') {
                const start = (schedule.bookChapters.startChapter || 1) + schedule.currentChapter;
                const end = start + chaptersToRead - 1;
                readingDescription = start === end ? `Chapter ${start}` : `Chapters ${start}-${end}`;
            } else {
                // Bible logic is complex because it spans books.
                // Simplification for MVP: Just show "Next X Chapters" or handle simple case
                // Better: iterate through bibleBooks array to find where currentChapter lands
                let remaining = schedule.currentChapter;
                let currentRefIndex = 0;
                let startRef = null;

                // Find start position
                while (currentRefIndex < schedule.bibleBooks.length) {
                    const bookRef = schedule.bibleBooks[currentRefIndex];
                    const chaptersInBook = bookRef.endChapter - bookRef.startChapter + 1;

                    if (remaining < chaptersInBook) {
                        // Found the book where current reading starts
                        const bookStartChapter = bookRef.startChapter + remaining;
                        startRef = { book: bookRef.book, chapter: bookStartChapter };
                        break;
                    }
                    remaining -= chaptersInBook;
                    currentRefIndex++;
                }

                if (startRef) {
                    readingDescription = `${startRef.book} ${startRef.chapter}`;
                    if (chaptersToRead > 1) {
                        readingDescription += ` and next ${chaptersToRead - 1} chapters`;
                    }
                }
            }

            // Calculate next due date
            // Simple logic: if startDate is future, use that. Else, assume today/tomorrow based on last read? 
            // For now, simple projection from startDate based on pace is okay, or just "Next Reading"

            nextReading = {
                description: readingDescription,
                chaptersCount: chaptersToRead,
                estimatedTimeMinutes: chaptersToRead * (schedule.scheduleType === 'Bible' ? 7 : 15) // simple estimate
            };
        }

        plain.nextReading = nextReading;
        plain.progressPercentage = schedule.totalChapters > 0 ? Math.round((schedule.currentChapter / schedule.totalChapters) * 100) : 0;

        res.status(200).send(plain);
    } catch (err) {
        res.status(500).send({ message: err.message || "Error retrieving schedule." });
    }
};

// Update Schedule
exports.updateSchedule = async (req, res) => {
    try {
        const id = req.params.id;
        const { chaptersPerReading, readingsPerWeek, title } = req.body;

        const schedule = await ReadingSchedule.findOne({ where: { scheduleId: id, userId: req.user.id } });

        if (!schedule) {
            return res.status(404).send({ message: "Schedule not found." });
        }

        // Update fields
        if (title) schedule.title = title;
        if (chaptersPerReading) schedule.chaptersPerReading = chaptersPerReading;
        if (readingsPerWeek) schedule.readingsPerWeek = readingsPerWeek;

        // Recalculate end date
        if (chaptersPerReading || readingsPerWeek) {
            schedule.estimatedEndDate = calculateEndDate(
                schedule.startDate,
                schedule.totalChapters,
                schedule.chaptersPerReading,
                schedule.readingsPerWeek
            );
        }

        await schedule.save();
        res.status(200).send({ message: "Schedule updated successfully.", schedule });
    } catch (err) {
        res.status(500).send({ message: err.message || "Error updating schedule." });
    }
};

// Delete Schedule
exports.deleteSchedule = async (req, res) => {
    try {
        const id = req.params.id;
        const num = await ReadingSchedule.destroy({
            where: { scheduleId: id, userId: req.user.id }
        });

        if (num == 1) {
            res.status(200).send({ message: "Schedule deleted successfully." });
        } else {
            res.status(404).send({ message: "Schedule not found." });
        }
    } catch (err) {
        res.status(500).send({ message: err.message || "Error deleting schedule." });
    }
};

// Update Progress
exports.updateProgress = async (req, res) => {
    try {
        const id = req.params.id;
        const { chaptersRead } = req.body; // Number of additional chapters read, or explicit 'set to'

        // Let's assume input is "add these many chapters" for now, or we can support absolute setting.
        // For simplicity: "add X chapters"
        if (!chaptersRead || chaptersRead <= 0) {
            return res.status(400).send({ message: "Invalid chapters count." });
        }

        const schedule = await ReadingSchedule.findOne({ where: { scheduleId: id, userId: req.user.id } });

        if (!schedule) {
            return res.status(404).send({ message: "Schedule not found." });
        }

        // Update progress
        schedule.currentChapter = Math.min(schedule.currentChapter + chaptersRead, schedule.totalChapters);

        if (schedule.currentChapter >= schedule.totalChapters) {
            schedule.completed = true;
            schedule.isActive = false;
        }

        await schedule.save();

        res.status(200).send({
            message: "Progress updated.",
            currentChapter: schedule.currentChapter,
            completed: schedule.completed,
            progressPercentage: Math.round((schedule.currentChapter / schedule.totalChapters) * 100)
        });
    } catch (err) {
        res.status(500).send({ message: err.message || "Error updating progress." });
    }
};
