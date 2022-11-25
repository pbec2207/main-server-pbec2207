const mongoose = require("mongoose");


const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 50,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
        min: 10,
        max: 100,
    },
    zipCode:{
        type: Number,
        max:999999,
        min:1000
    },
    isDefault: {
        type: Boolean,
        default: false
    }
});


const DeliveryInfoSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        address: [addressSchema],
    },
    { collection:"deliveryInfo" ,timestamps: true }
);

mongoose.model("Address", addressSchema);
module.exports = mongoose.model("deliveryInfo", DeliveryInfoSchema);