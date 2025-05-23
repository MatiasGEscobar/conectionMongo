import app from './app';
import "dotenv/config";
import connectDB from './config/dbConfig';

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3001;

const serverOnline = async (): Promise<void> => {
    try {
        await connectDB();
        console.log('BDD online');
        app.listen(PORT, (): void => {
        console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
    console.error(error);
}
};

serverOnline();
