const { Sequelize } = require('sequelize');

// Create Sequelize instance with the same config as the app
const sequelize = new Sequelize('church_library', 'postgres', '2ndDBonmachine', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
});

async function checkActivityLogs() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established.');

        // Query the ActivityLogs table
        const [results] = await sequelize.query(`
            SELECT "logId", "actionType", "affectedResource", "createdAt" 
            FROM "ActivityLogs" 
            ORDER BY "createdAt" DESC 
            LIMIT 10;
        `);

        if (results.length === 0) {
            console.log('No activity logs found.');
        } else {
            console.log('\nRecent Activity Logs:');
            console.table(results);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

checkActivityLogs();
