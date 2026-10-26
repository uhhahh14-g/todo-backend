import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

// [GET] 할 일 목록 전체 조회 (/api/todos)
router.get('/', async (req, res) => {
  try {
    // 최신 등록순(-1)으로 모든 할 일 가져오기
    const todos = await Todo.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    console.error('할 일 목록 조회 중 에러 발생:', error);
    res.status(500).json({
      success: false,
      message: '할 일 목록을 가져오는 데 실패했습니다.',
      error: error.message,
    });
  }
});

// [POST] 할 일 생성 (/api/todos)
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '할 일 내용을 입력해주세요.',
      });
    }

    const newTodo = new Todo({
      title: title.trim(),
    });

    const savedTodo = await newTodo.save();

    res.status(201).json({
      success: true,
      data: savedTodo,
      message: '할 일이 성공적으로 생성되었습니다.',
    });
  } catch (error) {
    console.error('할 일 생성 중 에러 발생:', error);
    res.status(500).json({
      success: false,
      message: '서버 에러가 발생했습니다.',
      error: error.message,
    });
  }
});

// [PUT] 할 일 수정 (/api/todos/:id)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    // 업데이트할 항목 구성
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (completed !== undefined) updateData.completed = completed;

    // MongoDB에서 해당 ID의 데이터 수정 후 최신 데이터 반환
    const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: '해당 할 일을 찾을 수 없습니다.',
      });
    }

    res.status(200).json({
      success: true,
      data: updatedTodo,
      message: '할 일이 성공적으로 수정되었습니다.',
    });
  } catch (error) {
    console.error('할 일 수정 중 에러 발생:', error);
    res.status(500).json({
      success: false,
      message: '할 일 수정 중 서버 에러가 발생했습니다.',
      error: error.message,
    });
  }
});

// [DELETE] 할 일 삭제 라우터 (/api/todos/:id)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // ID로 찾아서 삭제
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({
        success: false,
        message: '해당 할 일을 찾을 수 없습니다.',
      });
    }

    res.status(200).json({
      success: true,
      data: deletedTodo,
      message: '할 일이 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error('할 일 삭제 중 에러 발생:', error);
    res.status(500).json({
      success: false,
      message: '할 일 삭제 중 서버 에러가 발생했습니다.',
      error: error.message,
    });
  }
});

export default router;
