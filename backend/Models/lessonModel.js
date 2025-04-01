import mongoose from "mongoose";

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
    },
    video: {
      fileId: mongoose.Schema.Types.ObjectId, // GridFS file ID
      filename: String,
      duration: Number, // Duration in seconds
      contentType: String,
      uploadDate: Date,
    },
    content: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);
export default Lesson;
