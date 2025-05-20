import "dotenv/config";
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.s1xjjxb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=${process.env.DB_CLUSTER}`);
        console.log('Conectado a la base de datos');
    } catch (error) {
        console.error('Error de conexión:', error);
        process.exit(1);
    }
};

export default connectDB;