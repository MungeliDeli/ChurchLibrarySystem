const db = require('./models');

async function inspect() {
    try {
        const queryInterface = db.sequelize.getQueryInterface();

        console.log('--- Users Table ---');
        const usersTable = await queryInterface.describeTable('users');
        console.log(JSON.stringify(usersTable, null, 2));

        console.log('\n--- LibraryItems Table ---');
        const libraryItemsTable = await queryInterface.describeTable('LibraryItems');
        console.log(JSON.stringify(libraryItemsTable, null, 2));

    } catch (error) {
        console.error('Error inspecting database:', error);
    } finally {
        await db.sequelize.close();
    }
}

inspect();
