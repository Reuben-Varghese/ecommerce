const Product = require("../../models/productSchema");
const Category = require("../../models/categorySchema");     
const User = require("../../models/userSchema");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp")

// View page of products
const getAllProducts = async (req,res) => {
    try {
        const search = req.query.search || "";
        const page = req.query.page || 1;
        const limit = 4;
        
        const productData = await Product.find({
            $or:[
                 {productName:{$regex:new RegExp(".*"+search+".*","i")}},
                {author:{$regex:new RegExp(".*"+search+".*","i")}},
            ],
        }).limit(limit*1)
        .skip((page-1)*limit)
        .populate("category")
        .exec()

        const count = await Product.find({
            $or:[
                {productName:{$regex:new RegExp(".*"+search+".*","i")}},
                {author:{$regex:new RegExp(".*"+search+".*","i")}},
            ],
        }).countDocuments();

        const category = await Category.find({isListed:true});

        if(category){
            res.render("admin/products",{
                data:productData,
                currentPage:page,
                totalPages:Math.ceil(count/limit),
                cat:category,

            })
        }else{
            res.render("admin/admin-error");
        }
        
    } catch (error) {

        console.error("Error in getAllProducts:", error.message);
    res.status(500).render("admin/admin-error", { message: "Something went wrong loading products." });
        
    }
    
}

// Add Products (Books)
const getProductAddPage = async (req,res) => {
    try {
        const category = await Category.find({isListed:true});
        res.render("admin/product-add",{
            cat:category
        });
        
    } catch (error) {
        res.redirect("/pageerror")
    }
    
}




module.exports = {
    getAllProducts,
    getProductAddPage
}