import express from "express"
import { addProductController, getAllProductController } from "../controllers/productController.js";
import { addCategoryController, getAllCategoryController } from "../controllers/categoryController.js";

const router = express.Router();
router.post('/api/upload/product', addProductController);
router.post('/api/upload/category', addCategoryController);
router.get('/api/get/products', getAllProductController);
router.get('/api/get/categories', getAllCategoryController);

// Start the server
export default router