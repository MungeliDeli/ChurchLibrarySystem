const db = require('./models');

async function checkAdmin() {
    try {
        await db.sequelize.authenticate();
        const admin = await db.User.findOne({ where: { email: 'admin@example.com' } });
        if (admin) {
            console.log('Admin user found:', admin.toJSON());
        } else {
            console.log('Admin user NOT found.');
        }
    } catch (error) {
        console.error('Error checking admin:', error);
    } finally {
        await db.sequelize.close();
        process.exit();
    }
}

checkAdmin();
