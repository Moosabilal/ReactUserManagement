import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import userRouter from './routes/user.js';
import connectToDatabase from './db/db.js'


connectToDatabase();
const app = express();

const allowedOrigins = process.env.CLIENT_URL.split(",");

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"), false);
    }
  },
  credentials: true
}));
app.use(express.json()) 
app.use('/api/auth',authRouter)
app.use('/api/profile',profileRouter)
app.use('/api/user',userRouter)

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);    
})