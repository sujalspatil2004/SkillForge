// import mongoose from "mongoose";

// const CourseSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     technology: { type: String, required: true },
//     pathway: { type: Array, required: true },
//     progress: { type: Number, default: 0 }  // Progress percentage
// });

// export default mongoose.model("Course", CourseSchema);

// import mongoose from "mongoose";

// const CourseSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     technology: { type: String, required: true },
//     pathway: { type: [mongoose.Schema.Types.Mixed], required: true },  // Accepts any type
//     progress: { type: Number, default: 0 }  // Progress percentage
// });


// export default mongoose.model("Course", CourseSchema);

// import mongoose from "mongoose";

// const CourseSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
//     technology: { type: String, required: true },
//     pathway: [{
//         name: { type: String, required: true },  // Section name
//         children: [{
//             name: { type: String, required: true },  // Step name
//             quiz: { type: Object, default: null }  // Quiz (optional)
//         }]
//     }],
//     progress: { type: Number, default: 0, min: 0, max: 100 }  // Progress percentage
// });

// export default mongoose.model("Course", CourseSchema);

import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    technology: { type: String, required: true },
    pathway: [{
        name: { type: String, required: true },  // Section name
        children: [{
            name: { type: String, required: true },  // Step name
            quiz: { 
              question: { type: String },
              options: { type: [String] },
              correctAnswer: { type: String }
            }  // Quiz (optional)
        }]
    }],
    progress: { type: Number, default: 0, min: 0, max: 100 },  // Progress percentage
    completedSteps: { type: [String], default: [] } // Array of step IDs (sectionIndex-stepIndex)
});

export default mongoose.model("Course", CourseSchema);