import app from './server';
import "dotenv/config";
import { connectDB } from './config/dbConfig';

const PORT = process.env.PORT;

const serverOnline = async (): Promise<void> => {
    try {
        await connectDB();
        console.log('Server online');
        app.listen(PORT, (): void => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (error) {
    console.error(error);
}
};

serverOnline();
