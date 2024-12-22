import express from "express";
import {
  addProductController,
  getAllProductController,
} from "../controllers/productController.js";
import {
  addCategoryController,
  deleteCategoryController,
  getAllCategoryController,
} from "../controllers/categoryController.js";
import { getHomePageData } from "../controllers/homePageController.js";
import {
  addNewUserController,
  findUserByEmailController,
} from "../controllers/userController.js";
import {
  getPubKeyController,
  initPaymentSheetController,
  saveOrderInfo,
} from "../controllers/paymentController.js";
import {
  addToWishlistController,
  getWishlistItemsController,
  removeFromWishlistController,
} from "../controllers/wishlistController.js";
import {
  addListing,
  deleteListing,
  getListings,
  updateListing,
} from "../controllers/marketplaceProductController.js";

const router = express.Router();
router.post("/api/upload/product", addProductController);
router.post("/api/upload/category", addCategoryController);
router.get("/api/get/products", getAllProductController);
router.get("/api/get/categories", getAllCategoryController);
router.delete("/api/remove/categories/:id", deleteCategoryController);

router.post("/api/add/user", addNewUserController);
router.post("/api/get/home", getHomePageData);

router.get("/api/get/pubkey", getPubKeyController);
router.post("/api/post/payment-sheet", initPaymentSheetController);
router.post("/api/post/order", saveOrderInfo);

router.post("/api/find/user", findUserByEmailController);

router.post("/api/add/wishlist", addToWishlistController);
router.post("/api/remove/wishlist", removeFromWishlistController);
router.post("/api/all/wishlist", getWishlistItemsController);

router.get("/api/all/listings", getListings);
router.post("/api/add/listings", addListing);
router.put("/listings/:id", updateListing);
router.delete("/api/remove/listings/:id", deleteListing);

export default router;
