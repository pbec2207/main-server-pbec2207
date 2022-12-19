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
    addressCode:{
        district: {type: Number, default: 1},
        province: {type: Number, default: 1},
        ward:{type: Number, default: 1},
        street:{type: String, default: ""}
    },
    zipCode:{
        type: Number,
        max:999999,
        min:1000
    },
    code:{
        type: Number,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
},{
    collection:"addresses",
    timestamps: true
});


const DeliveryInfoSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "users",
        },
        address: [addressSchema],
    },
    { collection:"deliveryInfo" ,timestamps: true }
);

mongoose.model("addresses", addressSchema);
module.exports = mongoose.model("deliveryInfo", DeliveryInfoSchema);