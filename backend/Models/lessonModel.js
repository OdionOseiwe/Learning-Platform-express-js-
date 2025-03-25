import mongoose from 'mongoose';

const lessonSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    duration: {
      type: Number, // in minutes
    },
    resources: [
      {
        title: String,
        fileUrl: String,
        fileType: String,
      },
    ],
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    quiz: {
      title: String,
      timeLimit: Number, // in minutes
      passingScore: {
        type: Number,
        default: 70,
      },
      questions: [
        {
          question: {
            type: String,
            required: true,
          },
          options: [
            {
              text: String,
              isCorrect: Boolean,
            },
          ],
          type: {
            type: String,
            enum: ['multiple-choice', 'true-false', 'short-answer'],
            default: 'multiple-choice',
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const Lesson = mongoose.model("Lesson", lessonSchema);
