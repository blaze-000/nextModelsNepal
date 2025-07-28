import app from '../app';
import dotenv from 'dotenv';
import { connectDB } from './db';

dotenv.config();

const PORT = process.env.PORT;

async function startServer() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();