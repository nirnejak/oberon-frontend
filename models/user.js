import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    active: Boolean,
    age: Number,
    fullName: String,
    meta: {
      careerScore: Number,
      drinkingFrequency: Number,
      isNightOwl: Boolean,
      livingSituation: String, // Alone, Roommates, Family
      profession: String, // Student, Employed, Unemployed
    },
  },
  { timestamps: true }
);

const user = mongoose.model("User", userSchema);

export default user;
