const { LibraryItem, ActivityLog, ReadingProgress, Category } = require('../../models');
const { Op, Sequelize } = require('sequelize');
const { getSignedUrlForS3Key } = require('../utils/s3');

// Helper function to sign URLs for a list of items
const signCoverImageUrls = async (items) => {
  return Promise.all(
    items.map(async (item) => {
      const plainItem = item.toJSON ? item.toJSON() : { ...item };
      if (plainItem.coverImageUrl) {
        plainItem.coverImageUrl = await getSignedUrlForS3Key(plainItem.coverImageUrl);
      }
      return plainItem;
    })
  );
};


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
        const signedNewArrivals = await signCoverImageUrls(newArrivals);
        res.json(signedNewArrivals);
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
        const signedFeaturedItems = await signCoverImageUrls(featuredItems);
        res.json(signedFeaturedItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching featured items.', error: error.message });
    }
};

// GET /api/home/trending
exports.getTrending = async (req, res) => {
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
                createdAt: {
                    [Op.gte]: thirtyDaysAgo
                }
            },
            group: ['affectedResource'],
            order: [['activityCount', 'DESC']],
            limit: 10
        });

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

        const signedLibraryItems = await signCoverImageUrls(libraryItems);
        res.json(signedLibraryItems);
    } catch (error) {
        console.error('Error in getTrending:', error);
        res.status(500).json({ message: 'Error fetching trending items.', error: error.message });
    }
};

// GET /api/home/continue-reading
exports.getContinueReading = async (req, res) => {
    try {
        const userId = req.user.id;

        const recentActivities = await ActivityLog.findAll({
            where: {
                actorId: userId,
                actionType: 'Read'
            },
            order: [['createdAt', 'DESC']],
            limit: 10
        });

        if (!recentActivities.length) {
            return res.json([]);
        }

        const uniqueItemIds = [...new Set(recentActivities.map(act => act.affectedResource))];

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

        const progressRecords = await ReadingProgress.findAll({
            where: {
                userId,
                itemId: {
                    [Op.in]: uniqueItemIds
                }
            }
        });

        const signedLibraryItems = await signCoverImageUrls(libraryItems);

        const orderedItems = uniqueItemIds
            .map(id => {
                const item = signedLibraryItems.find(item => item.itemId === id);
                if (!item) return null;
                const progress = progressRecords.find(p => p.itemId === id);
                return {
                    ...item,
                    progress: progress ? progress.progress : 0
                };
            })
            .filter(Boolean)
            .slice(0, 5);

        res.json(orderedItems);

    } catch (error) {
        console.error('Error in getContinueReading:', error);
        res.status(500).json({ message: 'Error fetching continue reading items.', error: error.message });
    }
};
