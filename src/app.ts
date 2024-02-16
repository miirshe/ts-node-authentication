// importing packages
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
// import files 
import { PORT } from './config/initial.config';
import connectDB from './config/db.config';
import userRouter from './routes/user.router';


// initialize app
const app = express();
app.use(cors({ credentials: true }))
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// routes
app.use('/',userRouter)

// connecting to database
connectDB();

// listening to server
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:/${PORT}`);
})

