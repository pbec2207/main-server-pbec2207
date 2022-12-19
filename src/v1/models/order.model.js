const mongoose = require('mongoose');
const { boolean } = require('yup');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        require: true
    },
    address: {
        type: Object,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    subtotal:{
        type: Number,
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
        },
        variant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "variants"
        },
        shippingCode:{
            type: Number,
            required: true
        },
        currency:{
            type: String,
            enum: ["VND", "USD"],
            default: "VND"
        },
        discount:{
            type: Number,
            min:0,
            max:100,
            default: 0
        },
        price: {
            type: Number,
            required: true
        },
        totalPaid:{
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        shippingCost:{
            type: Number,
            default: 0
        },
        isCancel:{
            type: Boolean,
            default: false
        },
        isDeleted:{
            type: Boolean,
            default: false
        },
        seller:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "sellers",
        },
        orderStatus: [{
            type: {
                type: String,
                enum: ["ordered", "packed", "shipped", "delivered"],
                default: "ordered"
            },
            date: {
                type: Date,
                default: Date.now()
            },
            isCompleted: {
                type: Boolean,
                default: false
            }
        }],
        createdAt: {type: Date, default: Date.now()},
        updatedAt: {type: Date, default: Date.now()}
    }],
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "cancelled", "refund"],
        required: true
    },
    paymentType: {
        type: String,
        enum: ["cod", "paypal"],
        default: "cod"
    },
    shippingCost:{
        type: Number,
        default: 0
    },
    orderStatus: [{
        type: {
            type: String,
            enum: ["ordered", "packed", "shipped", "delivered"],
            default: "ordered"
        },
        date: {
            type: Date,
            default: Date.now()
        },
        isCompleted: {
            type: Boolean,
            default: false
        }
    }]
}, { collection:"orders", timestamps: true }
)

module.exports = mongoose.model("orders", orderSchema);