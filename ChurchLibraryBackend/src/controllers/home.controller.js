const { LibraryItem, ActivityLog, ReadingProgress, Category } = require('../../models');
const { Op, Sequelize } = require('sequelize');

// GET /api/home/new-arrivals
exports.getNewArrivals = async (req, res) => {
    try {
        const newArrivals = await LibraryItem.findAll({
            order: [['createdAt', 'DESC']],
            limit: 10,
            include: [{
                model: Category,
                attributes: ['categoryId', 'name'],
            }],
        });
        res.json(newArrivals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching new arrivals.', error: error.message });
    }
};

// GET /api/home/featured
exports.getFeatured = async (req, res) => {
    try {
        const featuredItems = await LibraryItem.findAll({
            where: { isFeatured: true },
            limit: 10,
            include: [{
                model: Category,
                attributes: ['categoryId', 'name'],
            }],
        });
        res.json(featuredItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching featured items.', error: error.message });
    }
};

// GET /api/home/trending
exports.getTrending = async (req, res) => {
    console.log('getTrending function called');
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const trendingItems = await ActivityLog.findAll({
            attributes: [
                'affectedResource',
                [Sequelize.fn('COUNT', Sequelize.col('affectedResource')), 'activityCount']
            ],
            where: {
                actionType: {
                    [Op.or]: ['Read', 'Download']
                },
                timestamp: {
                    [Op.gte]: thirtyDaysAgo
                }
            },
            group: ['affectedResource'],
            order: [[Sequelize.literal('activityCount'), 'DESC']],
            limit: 10
        });

        console.log('trendingItems:', trendingItems);

        const itemIds = trendingItems.map(item => item.affectedResource);

        // Filter out invalid UUIDs
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const validItemIds = itemIds.filter(id => id && uuidRegex.test(id));

        if (validItemIds.length === 0) {
            return res.json([]);
        }

        const libraryItems = await LibraryItem.findAll({
            where: {
                itemId: {
                    [Op.in]: validItemIds
                }
            },
            include: [{
                model: Category,
                attributes: ['categoryId', 'name'],
            }],
        });

        res.json(libraryItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trending items.', error: error.message });
    }
};

// GET /api/home/continue-reading
exports.getContinueReading = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming verifyToken middleware attaches user info

        // Get the last 10 read activities for the user
        const recentActivities = await ActivityLog.findAll({
            where: {
                actorId: userId,
                actionType: 'Read'
            },
            order: [['timestamp', 'DESC']],
            limit: 10
        });

        if (!recentActivities.length) {
            return res.json([]);
        }

        // Get unique item IDs from the activities, preserving order
        const uniqueItemIds = [...new Set(recentActivities.map(act => act.affectedResource))];

        // Fetch the corresponding library items
        const libraryItems = await LibraryItem.findAll({
            where: {
                itemId: {
                    [Op.in]: uniqueItemIds
                }
            },
            include: [{
                model: Category,
                attributes: ['categoryId', 'name'],
            }],
        });

        // Fetch the progress for these items
        const progressRecords = await ReadingProgress.findAll({
            where: {
                userId,
                itemId: {
                    [Op.in]: uniqueItemIds
                }
            }
        });

        // Map the library items back to the order of uniqueItemIds and add the real progress
        const orderedItems = uniqueItemIds
            .map(id => {
                const item = libraryItems.find(item => item.itemId === id);
                if (!item) return null;
                const progress = progressRecords.find(p => p.itemId === id);
                return {
                    ...item.toJSON(),
                    progress: progress ? progress.progress : 0
                };
            })
            .filter(Boolean) // Remove any nulls if an item wasn't found
            .slice(0, 5); // Limit to the top 5

        res.json(orderedItems);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching continue reading items.', error: error.message });
    }
};
