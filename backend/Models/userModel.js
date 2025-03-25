import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified:{
      type:Boolean,
      default:false
  },
  resetPasswordToken:String,
  resetPasswordExpireAt:Date,
  verificationToken:String,
  verificationTokenExpireAt:Date,
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',
    },
    enrolledLessons: [
      {
        lessonId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Lesson',
        },
        completed: {
          type: Boolean,
          default: false,
        },
        quizResult: {
          score: Number,
          completedAt: Date,
          passed: Boolean,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


export const User = mongoose.model('User', userSchema);
