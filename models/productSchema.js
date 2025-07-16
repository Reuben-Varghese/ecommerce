const mongoose = require("mongoose");
const {Schema} = mongoose;



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
    salePrice: {
        type: Number,
        required: true
    },
    // stock: {
    //     type: Number,
    //     required: true
    // },
    productImage: {
        type: [String],
        required:true
    },
    description: {
        type: String,
        required: true
    },
    offer: {
        type: Schema.Types.ObjectId,
        ref: 'Offer'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    },
    status:{
        type : String,
        enum :["Available","Out of stock","Discontinued"],
        required:true,
        default:"Available"
    },

},{timestamps:true});


const Product = mongoose.model('Product', productSchema);

module.exports = Product
