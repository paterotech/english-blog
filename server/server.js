import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import multer from 'multer';
import connectDB from './configs/db.js';
import adminRouter from './routes/adminRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import commentRouter from './routes/commentRoutes.js';

const app = express();
await connectDB();

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.get('/', (req, res) => {res.send('API is working!')});
app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);
app.use('/api/comment', commentRouter);

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        const message = err.code === 'LIMIT_FIELD_VALUE'
            ? 'Blog content is too large. If you pasted images into the editor, remove them and upload a thumbnail instead.'
            : `Upload error: ${err.message}`;
        return res.status(400).json({ success: false, message });
    }
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})

export default app;
