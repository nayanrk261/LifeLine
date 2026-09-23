require('dotenv').config();

const User = require('./models/user');
const connectDB = require('./config/db');

const testUser = async () => {
    await connectDB();

    const user = await User.create({
        name: "Test User",
        email: "testuser@gamil.com",
        passwordHash: "testpassword"
    });
    console.log(user);
}

testUser();