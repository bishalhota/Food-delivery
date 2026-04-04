import mongoose from 'mongoose';

const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI as string,{
            dbName: "Zomato_clone_Db",
        })
        console.log('MongoDB connected');
    } catch (error) {
        console.error(error);
    }
}

export default connectDB;