const db = require('./models');

async function inspect() {
    try {
        const queryInterface = db.sequelize.getQueryInterface();

        // console.log('--- Users Table ---');
        // const usersTable = await queryInterface.describeTable('users');
        // console.log(JSON.stringify(usersTable, null, 2));

        console.log('\n--- LibraryItems Table ---');
        try {
            const libraryItemsTable = await queryInterface.describeTable('LibraryItems');
            console.log(JSON.stringify(libraryItemsTable, null, 2));
        } catch (e) { console.log('LibraryItems table not found or error:', e.message); }

        console.log('\n--- ActivityLogs Table ---');
        // Note: Table name might be pluralized or not depending on settings. Model says 'ActivityLog' and default is pluralized 'ActivityLogs'
        try {
            const activityLogsTable = await queryInterface.describeTable('ActivityLogs');
            console.log(JSON.stringify(activityLogsTable, null, 2));
        } catch (e) { console.log('ActivityLogs table not found or error:', e.message); }

        console.log('\n--- Reviews Table ---');
        try {
            const reviewsTable = await queryInterface.describeTable('Reviews');
            console.log(JSON.stringify(reviewsTable, null, 2));
        } catch (e) { console.log('Reviews table not found or error:', e.message); }

    } catch (error) {
        console.error('Error inspecting database:', error);
    } finally {
        await db.sequelize.close();
    }
}

inspect();
