const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            index:true
        },
        categoryImage: {
            type: String,
            default:""
        },
        specs:{type: Array, default:[]},
        isDisabled: false
    },
    { 
      collection:"categories",
      timestamps: true
     }
);
categorySchema.index({"specs.k":1, "specs.v":1})

module.exports = mongoose.model("categories", categorySchema);