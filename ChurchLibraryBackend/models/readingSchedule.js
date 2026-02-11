'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ReadingSchedule extends Model {
        static associate(models) {
            ReadingSchedule.belongsTo(models.User, { foreignKey: 'userId' });
            ReadingSchedule.belongsTo(models.LibraryItem, { foreignKey: 'itemId', allowNull: true });
        }
    }
    ReadingSchedule.init({
        scheduleId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        itemId: {
            type: DataTypes.UUID,
            allowNull: true, // Nullable because it can be a Bible schedule which isn't a LibraryItem
            references: {
                model: 'LibraryItems',
                key: 'itemId'
            }
        },
        scheduleType: {
            type: DataTypes.ENUM('Bible', 'Book'),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        bibleBooks: {
            type: DataTypes.JSONB, // Array of { book: 'Genesis', startChapter: 1, endChapter: 50 }
            allowNull: true
        },
        bookChapters: {
            type: DataTypes.JSONB, // { startChapter: 1, endChapter: 20 }
            allowNull: true
        },
        chaptersPerReading: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        readingsPerWeek: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 7
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        estimatedEndDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        currentChapter: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0 // Tracks cumulative chapters read across the whole schedule
        },
        totalChapters: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'ReadingSchedule',
    });
    return ReadingSchedule;
};
