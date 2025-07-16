const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin/adminController"); 
const customerController = require("../controllers/admin/customerController")
const categoryController = require("../controllers/admin/categoryController")
const productController = require("../controllers/admin/productController")
const {userAuth,adminAuth} = require("../middlewares/auth")
const multer = require("multer");
const upload = require("../helpers/multer"); 
// Error management
router.get("/pageerror",adminController.pageerror);
// Login management
router.get("/login",adminController.loadLogin);
router.post("/login",adminController.login);
router.get("/",adminAuth,adminController.loadDashboard);
router.get("/logout",adminController.logout);
// Customer management
router.get("/users",adminAuth,customerController.customerInfo);
router.get("/blockCustomer",adminAuth,customerController.customerBlocked);
router.get("/unblockCustomer",adminAuth,customerController.customerunBlocked);
// category management
router.get("/category",adminAuth,categoryController.categoryInfo);
router.post("/addCategory",adminAuth,categoryController.addCategory);
router.post("/addCategoryOffer",adminAuth,categoryController.addCategoryOffer); 
router.post("/removeCategoryOffer",adminAuth,categoryController.removeCategoryOffer); 
router.get("/listCategory",adminAuth,categoryController.getListCategory); 
router.get("/unlistCategory",adminAuth,categoryController.getUnlistCategory); 
router.get("/editCategory",adminAuth,categoryController.getEditCategory); 
router.post("/editCategory/:id",adminAuth,categoryController.editCategory);   
router.delete('/deleteCategory',adminAuth,categoryController.deleteCategory);
// Products Managements
router.get('/products',adminAuth,productController.getAllProducts);
router.get('/products/add',adminAuth,productController.getProductAddPage);
router.post('/products/add',adminAuth,upload.array("image",4),productController.addProducts);










module.exports = router



