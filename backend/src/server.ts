import { config } from 'dotenv';

import app from './app';
import { connectDB } from './config/db';

config();

const PORT = process.env.PORT;

async function startServer() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();