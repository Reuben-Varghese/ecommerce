const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    // binding: {
    //     type: String,
    //     required: true
    // },
    // publishingDate: {
    //     type: Date,
    //     required: true
    // },
    // publisher: {
    //     type: String,
    //     required: true
    // },
    // edition: {
    //     type: String
    // },
    pages: {
        type: Number
    },
    language: {
        type: String
    },
    regularPrice: {
        type: Number,
        required: true
    },

    salePrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },

    productImage: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    productOffer: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    status: {
        type: String,
        enum: ["Available", "Out of stock", "Discontinued"],
        required: true,
        default: "Available"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }

}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
