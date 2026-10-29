import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', ()=> console.log('MongoDB Atlas connected...'));
    await mongoose.connect(process.env.MONGODB);
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  } 
};

export default connectDB;