const Product = require("../../models/productSchema");
const Category = require("../../models/categorySchema");
const User = require("../../models/userSchema");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");


// View page of products
const getAllProducts = async (req, res) => {
    try {
        const search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const limit = 4;

        const searchQuery = {
            $or: [
                { productName: { $regex: new RegExp(".*" + search + ".*", "i") } },
                { author: { $regex: new RegExp(".*" + search + ".*", "i") } },
            ],
        };

        const productData = await Product.find(searchQuery)
            .sort({_id:-1})
            .limit(limit)
            .skip((page - 1) * limit)
            .populate("category")
            .exec();

        const count = await Product.countDocuments(searchQuery);
        const category = await Category.find({ isListed: true });

        if (category && category.length > 0) {
            res.render("admin/products", {
                data: productData,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                cat: category,
            });
        } else {
            res.render("admin/admin-error");
        }
    } catch (error) {
        console.error("Error in getAllProducts:", error.message);
        res
            .status(500)
            .render("admin/admin-error", { message: "Something went wrong loading products." });
    }
};

// Add Products (Books)
const getProductAddPage = async (req, res) => {
    try {
        const category = await Category.find({ isListed: true });
        res.render("admin/product-add", {
            cat: category
        });
    } catch (error) {
        res.redirect("/pageerror")
    }
}

// addProducts
const addProducts = async (req, res) => {
    try {
        const products = req.body;
        const productExists = await Product.findOne({
            productName: products.productName,
        })
        if (!productExists) {
            const images = [];
            if (req.files && req.files.length > 0) {
                for (let i = 0; i < req.files.length; i++) {
                    const originalImagePath = req.files[i].path;
                    const filename = req.files[i].filename;
                    const resizedImagePath = path.join("public","uploads","product-images",filename);
                    await sharp(originalImagePath)
                        .resize({ width: 440, height: 440 })
                        .toFile(resizedImagePath);
                    images.push("/uploads/product-images/"+filename);
                }
            }
            const categoryId = await Category.findOne({ name: products.category });
            if (!categoryId) {
                return res.status(400).send("Invalid category name");
            }
            const newProduct = new Product({
                productName: products.productName,
                description: products.description,
                author: products.author,
                isbn: products.isbn,
                category: categoryId._id,
                regularPrice: parseFloat(products.regularPrice),
                salePrice: parseFloat(products.salePrice),
                createdOn: new Date(),
                quantity: parseInt(products.quantity),
                size: products.size,
                language: products.language,
                productImage: images,
                status: "Available"

            })

            await newProduct.save();
            return res.redirect("/admin/products/add");
        } else {
            return res.status(400).send("Product already exists, please try with another name");
        }
    } catch (error) {
        console.error("Error saving product", error);
        return res.redirect("/admin/pageerror")
    }
}


const addProductOffer = async (req,res) => {
    try {
        const {productId,percentage} = req.body;
        const findProduct = await Product.findOne({_id:productId});
        const findCategory = await Category.findOne({_id:findProduct.category})
        if(findCategory.categoryOffer>percentage){
             return res.json({status:false,message:"This products category already has a category offer"})
        }
        findProduct.salePrice = findProduct.salePrice-Math.floor(findProduct.regularPrice*(percentage/100));
        findProduct.productOffer = parseInt(percentage);
        await findProduct.save();
        findCategory.categoryOffer = 0;
        await findCategory.save();
        res.json({status:true})
    } catch (error) {
        res.redirect("/pageerror");
        res.status(500).json({status:false,message:"Internal Server Error"})
    }
}


const removeProductOffer = async (req,res) => {
    try {
        const {productId} = req.body
        const findProduct = await Product.findOne({_id:productId})  
        const percentage = findProduct.productOffer;
        findProduct.salePrice = findProduct.salePrice+Math.floor(findProduct.regularPrice*(percentage/100))
        findProduct.productOffer = 0;
        await findProduct.save();
        res.json({status:true})
    } catch (error) {
        res.redirect("/pageerror")
    }
}




module.exports = {
    getAllProducts,
    getProductAddPage,
    addProducts,
    addProductOffer,
    removeProductOffer
}