import express from 'express'; // Web framework for Node.js
import cors from 'cors'; // It is a middleware allows frontend to communicate with backend 
import 'dotenv/config'; // Loads environment variables from a .env file into process.env.
import cookieParser from 'cookie-parser';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import postRouter from './routes/postRoutes.js';
import storyRouter from './routes/storyRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import authRouter from './routes/authRoutes.js';
import { corsOptions } from './configs/cors.js';

const app = express();

await connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.get('/',(req,res)=>res.send('Server is running '));
app.use('/api/auth', authRouter);
app.use('/api/user',userRouter)
app.use('/api/post',postRouter)
app.use('/api/story',storyRouter)
app.use('/api/message',messageRouter)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
