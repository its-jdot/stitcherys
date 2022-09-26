const express = require("express");
const { Product } = require("../models/productModel");
const router = express.Router();
// const multer = require("multer");
//const fs = require("fs");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploadImages/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
//   fileFilter: function (req, file, cb) {
//     if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   },
// });

// const upload = multer({ storage: storage });

//create product
router.post(
  "/create",
  auth,
  admin,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        name,
        brand,
        price,
        quantity,
        description,
        deliveryCharges,
        deliveryDays,
        category,
      } = req.body;
      if (
        !name ||
        !brand ||
        !price ||
        !quantity ||
        !description ||
        !category ||
        !deliveryCharges ||
        !deliveryDays
      )
        return res
          .status(400)
          .json({ msg: "Not all fields have been entered" });

      const result = await cloudinary.uploader.upload(req.file.path);
      const product = new Product({
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price,
        quantity: req.body.quantity,
        description: req.body.description,
        deliveryDays: req.body.deliveryDays,
        deliveryCharges: req.body.deliveryCharges,
        category: req.body.category,
        imageURL: result.secure_url,
        cloudinary_id: result.public_id,
      });
      await product.save((err) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true });
      });
    } catch (err) {
      console.log(err);
    }
  }
);

//get product
router.get("/get", async (req, res) => {
  await Product.find((err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(doc);
  });
});

//get cateogries of Products
router.get("/get/category", auth, async (req, res) => {
  function remove_duplicates(arr) {
    var obj = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
      obj[arr[i]] = true;
    }
    for (var key in obj) {
      ret_arr.push(key);
    }
    return ret_arr;
  }
  let arr = [];
  const category = await Product.find().select({ category: 1 });
  category.map((data) => {
    arr.push(data.category);
  });

  res.status(200).send(remove_duplicates(arr));
});

//  get Product by category
router.get("/get/productBy/:category", auth, async (req, res) => {
  try {
    await Product.find({ category: req.params.category }, (err, doc) => {
      if (err) res.status(400).send(err);
      res.status(200).send(doc);
    });
  } catch (err) {
    console.log(err);
  }
});

//get by Id
router.get("/get/:id", async (req, res) => {
  await Product.findById(req.params.id).exec((err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(doc);
  });
});

//delete product
router.delete("/delete/:id", auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete({ _id: req.params.id });
    await cloudinary.uploader.destroy(product.cloudinary_id);
  } catch (err) {
    console.log(err);
  }

  // fs.unlink(product.imagePath, (err) => {
  //   if (err) console.log(err);
  //   console.log("file deleted from directory");
  // });
});

//update product
router.put(
  "/update/:id",
  auth,
  admin,
  upload.single("image"),
  async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate({ _id: req.params.id });
      if (req.body.cloudinary_id === "") {
        await cloudinary.uploader.destroy(product.cloudinary_id);
        const result = await cloudinary.uploader.upload(req.file.path);
        (product.imageURL = result.secure_url),
          (product.cloudinary_id = result.public_id);
      }
      product.name = req.body.name;
      product.brand = req.body.brand;
      product.category = req.body.category;
      product.price = req.body.price;
      product.quantity = req.body.quantity;
      product.deliveryDays = req.body.deliveryDays;
      product.deliveryCharges = req.body.deliveryCharges;
      product.description = req.body.description;

      await product.save();
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = router;
