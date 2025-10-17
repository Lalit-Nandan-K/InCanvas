import mongoose from 'mongoose';

const connectDB = async()=>{
  try {
    mongoose.connection.on('connected',()=> console.log('database Connected'))
    
    await mongoose.connect(`${process.env.MONGODB_URL}/incanvas`) 
  } catch (error) {
    console.error("Error in connecting with MongoDB",error.message);
    
  }
}

export default connectDB


// await mongoose.connect(`${process.env.MONGODB_URL}/'____'`);
// I append the databse name at the end because in the MONGODB_URL i haven't provide the databse name.
//This means your cluster will have a database named incanvas.If it doesn’t exist, MongoDB will automatically create it when you store data.



// In SamvadLive

// import mongoose from "mongoose";
// export const connectDB = async()=>{
//   try{
//     const conn = await mongoose.connect(process.env.MONGO_URL);
//     console.log(`MongoDB connected: ${conn.connection.host}`);
//   }catch(error){
//     console.error("Error in connecting with MongoDB..",error);
//     process.exit(1); // 1 means failure
//   }
// }

// Here i haven't provide any database name as the MONGODB_URL conntains it .
