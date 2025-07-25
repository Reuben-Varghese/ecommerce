const User = require("../../models/userSchema");

const customerInfo = async (req, res) => {
    try {
        let search = "";
        if (req.query.search) {
            search = req.query.search;
        }

        let page = 1;
        if (req.query.page) {
            page = req.query.page;
        }

        const limit = 3;

        const userData = await User.find({
            isAdmin: false,
            $or: [
                { name: { $regex: ".*" + search + ".*", $options: "i" } },
                { email: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        })
            .limit(limit)
            .skip((page - 1) * limit)
            .exec();

        const count = await User.countDocuments({
            isAdmin: false,
            $or: [
                { name: { $regex: ".*" + search + ".*", $options: "i" } },
                { email: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        });

        res.render("admin/customers", {
            data: userData,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
        });

    } catch (error) {
        console.error("Error loading customers:", error);
        res.status(500).send("Internal Server Error");
    }
};


const customerBlocked = async (req,res) => {
    try {

        let id = req.query.id;
        await User.updateOne({_id:id},{$set:{isBlocked:true}})
        res.redirect("/admin/users")
        
    } catch (error) {

        res.redirect("/pageerror")
        
    }
}



const customerunBlocked = async (req,res) => {
    try {

        let id = req.query.id;
        await User.updateOne({_id:id},{$set:{isBlocked:false}});
        res.redirect("/admin/users")
        
    } catch (error) {

        res.redirect("/pageerror")
        
    }  
}









module.exports = {
    customerInfo,
    customerBlocked,
    customerunBlocked,

};
