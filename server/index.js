import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import userRouter from './routes/user.js';
import connectToDatabase from './db/db.js'


connectToDatabase();
const app = express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
app.use(express.json()) 
app.use('/api/auth',authRouter)
app.use('/api/profile',profileRouter)
app.use('/api/user',userRouter)

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);    
})