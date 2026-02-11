'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ReadingSchedules', {
            scheduleId: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Changed to lowercase to match actual table name
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            itemId: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'LibraryItems', // Kept as PascalCase to match actual table name
                    key: 'itemId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            scheduleType: {
                type: Sequelize.ENUM('Bible', 'Book'),
                allowNull: false
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            bibleBooks: {
                type: Sequelize.JSONB,
                allowNull: true
            },
            bookChapters: {
                type: Sequelize.JSONB,
                allowNull: true
            },
            chaptersPerReading: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            readingsPerWeek: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 7
            },
            startDate: {
                type: Sequelize.DATE,
                allowNull: false
            },
            estimatedEndDate: {
                type: Sequelize.DATE,
                allowNull: true
            },
            currentChapter: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            totalChapters: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            completed: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ReadingSchedules');
    }
};
