// import mongoose from 'mongoose'

// export const connectDb = async() =>{
//     try{
//         await mongoose.connect(process.env.MONGO_URL,{
//             dbName: "SocialMediaDb",
//         });

//         console.log('Connected to mongodb');
//     }
//     catch(error){
//         console.log(error);
//     }
// };

// import mongoose from 'mongoose';
// export const connectDb = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL, {
//       dbName: 'SocialMediaDb',
//       //  useNewUrlParser: true,
//       //  useUnifiedTopology: true,
//     });
//     console.log('Connected to MongoDB');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     throw error;
//   }
// };



import mongoose from 'mongoose';

export const connectDb = async () => {
  try {
    console.log('Trying to connect to MongoDB...');
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: 'SocialMediaDb',
    });
    //console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};