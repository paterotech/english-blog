import mongoose from "mongoose";

mongoose.connection.on('connected', ()=> console.log('MongoDB Atlas connected...'));

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(process.env.MONGODB);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // En serverless no conviene terminar el proceso: se devuelve el error en la petición.
    if (!process.env.VERCEL) process.exit(1);
    throw error;
  }
};

export default connectDB;
