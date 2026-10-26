// 설치된 Express 라이브러리를 현재 코드(index.js)로 불러오는 구문
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import todoRoutes from './routes/todoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo';

app.use(cors());
app.use(express.json());

// 할 일(Todo) 라우터 연결
app.use('/api/todos', todoRoutes);

// 헬스체크 라우트
app.get('/', (req, res) => {
  res.send({ message: 'Todo Backend Server is running!' });
});

// 몽고디비 연결 및 서버 실행
const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('연결 성공');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('몽고디비 연결 실패:', error.message);
    process.exit(1);
  }
};

startServer();
