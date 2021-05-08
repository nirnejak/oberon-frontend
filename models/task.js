import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    isCompleted: { type: String, required: true, default: false },
    itemType: { type: String, required: true }, // Memory, Suggestion, Entertainment(Music,Video)
    meta: {
      effortRequired: { type: Number }, // Least, Low, Medium, High
      healingLevel: { type: Number }, // Effectiveness of the task
      appropriateTime: { type: Number }, // Morning, Afternoon, Evening, Night, Weekend Afternoon, Weekday Afternoon.
    },
  },
  { timestamps: true }
);

const task = mongoose.model("Task", taskSchema);

export default task;
