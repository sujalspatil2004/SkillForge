import express from "express";
import Pathway from "../models/Pathway.js"; // Assuming you have a Pathway model
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// 🔹 Save a Pathway
router.post("/save", authMiddleware, async (req, res) => {
    try {
        const { technology, pathway } = req.body;

        // Create a new pathway entry
        const newPathway = new Pathway({
            userId: req.user.id,  // User creating the pathway
            technology,
            pathway, // Save the pathway (assumed to be an object or structured data)
        });

        await newPathway.save();

        res.status(201).json({ message: "Pathway saved successfully", pathway: newPathway });
    } catch (error) {
        res.status(500).json({ error: "Failed to save pathway" });
    }
});

// 🔹 Get Pathways for a User
router.get("/", authMiddleware, async (req, res) => {
    try {
        // Fetch all pathways for the current user
        const pathways = await Pathway.find({ userId: req.user.id });

        if (!pathways || pathways.length === 0) {
            return res.status(404).json({ message: "No pathways found for this user" });
        }

        res.json(pathways);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch pathways" });
    }
});

router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const pathway = await Pathway.findById(req.params.id);

        if (!pathway) {
            return res.status(404).json({ message: "Pathway not found" });
        }

        res.json(pathway);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch pathway" });
    }
});









// 🔹 Update Pathway
router.put("/:pathwayId", authMiddleware, async (req, res) => {
    try {
        const { pathwayId } = req.params;
        const { pathway, progress } = req.body;

        // Find and update the pathway
        const updatedPathway = await Pathway.findOneAndUpdate(
            { _id: pathwayId, userId: req.user.id }, // Ensure it's the correct user
            { pathway, progress },  // Update the pathway and progress
            { new: true }
        );

        if (!updatedPathway) return res.status(404).json({ message: "Pathway not found" });

        res.json({ message: "Pathway updated", pathway: updatedPathway });
    } catch (error) {
        res.status(500).json({ error: "Failed to update pathway" });
    }
});

// 🔹 Delete a Pathway
router.delete("/:pathwayId", authMiddleware, async (req, res) => {
    try {
        const { pathwayId } = req.params;

        // Find and delete the pathway
        const deletedPathway = await Pathway.findOneAndDelete({
            _id: pathwayId,
            userId: req.user.id,  // Ensure it's the correct user
        });

        if (!deletedPathway) return res.status(404).json({ message: "Pathway not found" });

        res.json({ message: "Pathway deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete pathway" });
    }
});




// 🔹 Update only the progress of a specific pathway
router.put("/:pathwayId/progress", authMiddleware, async (req, res) => {
    try {
        const { pathwayId } = req.params;
        const { progress } = req.body; // Expecting progress updates
        
        // Find and update only the progress field
        const updatedPathway = await Pathway.findOneAndUpdate(
            { _id: pathwayId, userId: req.user.id }, // Ensure the correct user
            { $set: { progress } }, // Update only the progress field
            { new: true } // Return the updated document
        );
        
        if (!updatedPathway) {
            return res.status(404).json({ message: "Pathway not found" });
        }
        
        res.json({ message: "Progress updated", pathway: updatedPathway });
    } catch (error) {
        res.status(500).json({ error: "Failed to update progress" });
    }
});

export default router;

// import express from "express";
// import Course from "../models/Course.js";
// import authMiddleware from "../middleware/auth.js";

// const router = express.Router();

// // Get all courses for a user
// router.get("/", authMiddleware, async (req, res) => {
//     try {
//         const courses = await Course.find({ userId: req.user.id });
//         if (!courses || courses.length === 0) {
//             return res.status(404).json({ message: "No courses found for this user" });
//         }
//         res.json(courses);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch courses" });
//     }
// });

// // Get a specific course
// router.get("/:id", authMiddleware, async (req, res) => {
//     try {
//         const course = await Course.findById(req.params.id);
//         if (!course) {
//             return res.status(404).json({ message: "Course not found" });
//         }
//         res.json(course);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch course" });
//     }
// });

// // Get completed steps for a course
// router.get("/:id/completed-steps", authMiddleware, async (req, res) => {
//     try {
//         const course = await Course.findById(req.params.id);
//         if (!course) {
//             return res.status(404).json({ message: "Course not found" });
//         }
//         res.json({ completedSteps: course.completedSteps || [] });
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch completed steps" });
//     }
// });

// // Update course progress and completed steps
// router.put("/:id/progress", authMiddleware, async (req, res) => {
//     try {
//         const { progress, completedSteps } = req.body;
        
//         const updatedCourse = await Course.findOneAndUpdate(
//             { _id: req.params.id, userId: req.user.id },
//             { $set: { progress, completedSteps } },
//             { new: true }
//         );
        
//         if (!updatedCourse) {
//             return res.status(404).json({ message: "Course not found" });
//         }
        
//         res.json({ message: "Progress updated", course: updatedCourse });
//     } catch (error) {
//         res.status(500).json({ error: "Failed to update progress" });
//     }
// });

// // Complete a step and update quiz score
// router.post("/:id/complete-step", authMiddleware, async (req, res) => {
//     try {
//         const { sectionIndex, stepIndex, quizScore } = req.body;
//         const stepId = `${sectionIndex}-${stepIndex}`;
        
//         const course = await Course.findById(req.params.id);
//         if (!course) {
//             return res.status(404).json({ message: "Course not found" });
//         }

//         // Add to completed steps if not already there
//         const newCompletedSteps = [...new Set([...course.completedSteps, stepId])];
        
//         // Calculate new progress
//         const totalSteps = course.pathway.reduce((acc, section) => acc + section.children.length, 0);
//         const newProgress = Math.round((newCompletedSteps.length / totalSteps) * 100);

//         const updatedCourse = await Course.findOneAndUpdate(
//             { _id: req.params.id, userId: req.user.id },
//             { 
//                 $set: { 
//                     progress: newProgress,
//                     completedSteps: newCompletedSteps 
//                 },
//                 // Optionally store quiz scores if needed
//                 $push: { quizScores: { sectionIndex, stepIndex, score: quizScore } }
//             },
//             { new: true }
//         );
        
//         res.json({ message: "Step completed", course: updatedCourse });
//     } catch (error) {
//         res.status(500).json({ error: "Failed to complete step" });
//     }
// });

// // Other routes (delete, etc.) remain the same
// // ...

// export default router;