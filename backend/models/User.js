import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    pathways: [{ type: mongoose.Schema.Types.ObjectId, ref: "Courses" }] // Reference to pathways
});


export default mongoose.model("User", userSchema);
