// const mongoose = require('mongoose');

// const pathwaySchema = new mongoose.Schema({
//     technology: String,
//     pathway: Array,
// });

// module.exports = mongoose.model('Pathway', pathwaySchema);



// import mongoose from "mongoose";

// const pathwaySchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     technology: { type: String, required: true },
//     pathway: { type: Array, required: true }, // Pathway could be an array of steps or an object
//     progress: { type: String, default: "Not Started" }, // You can track the user's progress
//   },
//   { timestamps: true }
// );

// const Pathway = mongoose.model("Pathway", pathwaySchema);

// export default Pathway;

import mongoose from "mongoose";

const pathwaySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    technology: { type: String, required: true },
    pathway: { type: Array, required: true }, // Pathway could be an array of steps or an object
    progress: { type: String, default: "0" }, // You can track the user's progress
  },
  { timestamps: true }
);

const Pathway = mongoose.model("Pathway", pathwaySchema);

export default Pathway;
