const db = require('./models');

async function testRegister() {
    try {
        console.log('Connecting to DB...');
        await db.sequelize.authenticate();
        console.log('Connected.');

        const name = 'Test User ' + Date.now();
        const email = `testuser${Date.now()}@example.com`;
        const password = 'password123';

        console.log(`Attempting to create user: ${email}`);

        const newUser = await db.User.create({
            name,
            email,
            password,
            // role should default to 'member'
        });

        console.log('User created successfully:', newUser.toJSON());

    } catch (error) {
        console.error('ERROR CREATING USER:', error);
        if (error.original) {
            console.error('Original Error:', error.original);
        }
        if (error.errors) {
            console.error('Validation Errors:', error.errors);
        }
    } finally {
        await db.sequelize.close();
    }
}

testRegister();
