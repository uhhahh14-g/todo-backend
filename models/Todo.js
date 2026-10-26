import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, '할 일 내용을 입력해주세요.'],
      trim: true,
      maxlength: [100, '할 일은 100자 이내로 입력해주세요.'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // 생성일(createdAt)과 수정일(updatedAt)을 자동으로 기록합니다.
  }
);

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
