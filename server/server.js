import express from 'express'; // Web framework for Node.js
import cors from 'cors'; // It is a middleware allows frontend to communicate with backend 
import 'dotenv/config'; // Loads environment variables from a .env file into process.env.
import connectDB from './configs/db.js';
import {inngest , functions} from './inngest/index.js';
import { serve } from 'inngest/express';

const app = express();

await connectDB();

app.use(express.json());
app.use(cors ());

app.get('/',(req,res)=>res.send('Server is running '))

app.use("/api/inngest", serve({ client: inngest, functions }));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));