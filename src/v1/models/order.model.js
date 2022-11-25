const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryInfo.address",
        require: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        variant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Variant"
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "cancelled", "refund"],
        required: true
    },
    paymentType: {
        type: String,
        enum: ["cod", "card"],
        default: "cod"
    },
    orderStatus: [{
        type: {
            type: String,
            enum: ["ordered", "packed", "shipped", "delivered"],
            default: "ordered"
        },
        date: {
            type: Date,
        },
        isCompleted: {
            type: Boolean,
            default: false
        }
    }]
}, { collection:"orders", timestamps: true }
)

module.exports = mongoose.model("orders", orderSchema);