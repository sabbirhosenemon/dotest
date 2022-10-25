const express = require("express");
const multer = require("multer");
const {
  createSingleProduct,
  getAllProduct,
  getSingleProduct,
  updateSingleProduct,
  deleteSingleProduct,
} = require("./product.controllers");
const authorize = require("../../../utils/authorize"); // authentication middleware

const ProductRoutes = express.Router();

// store files in memory. we just directly upload to s3 and not store on disk
const storage = multer.memoryStorage();
// multer middleware
const upload = multer({ storage: storage });

ProductRoutes.post(
  "/",
  authorize("createProduct"),
  upload.single("image"),
  createSingleProduct
);
ProductRoutes.get("/", authorize("viewProduct"), getAllProduct);
ProductRoutes.get("/:id", authorize("viewProduct"), getSingleProduct);
ProductRoutes.put("/:id", authorize("updateProduct"), updateSingleProduct);
ProductRoutes.patch("/:id", authorize("deleteProduct"), deleteSingleProduct);

module.exports = ProductRoutes;
