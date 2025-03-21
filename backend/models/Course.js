// import mongoose from "mongoose";

// const CourseSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     technology: { type: String, required: true },
//     pathway: { type: Array, required: true },
//     progress: { type: Number, default: 0 }  // Progress percentage
// });

// export default mongoose.model("Course", CourseSchema);

import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    technology: { type: String, required: true },
    pathway: { type: [mongoose.Schema.Types.Mixed], required: true },  // Accepts any type
    progress: { type: Number, default: 0 }  // Progress percentage
});


export default mongoose.model("Course", CourseSchema);

