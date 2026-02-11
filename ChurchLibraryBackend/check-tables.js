const { Sequelize } = require('sequelize');

// Create Sequelize instance with the same config as the app
const sequelize = new Sequelize('church_library', 'postgres', '2ndDBonmachine', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
});

async function checkTables() {
    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Get all tables
        const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

        console.log('\n📋 Tables in database:');
        results.forEach(row => {
            console.log(`  - ${row.table_name}`);
        });

        // Check specifically for Users table (case variations)
        const [usersTables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND LOWER(table_name) = 'users';
    `);

        console.log('\n🔍 Looking for Users table (case-insensitive):');
        if (usersTables.length > 0) {
            usersTables.forEach(row => {
                console.log(`  Found: "${row.table_name}"`);
            });
        } else {
            console.log('  ❌ No Users table found!');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

checkTables();
