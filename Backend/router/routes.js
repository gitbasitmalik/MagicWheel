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
  getNotificationController,
  getShippingDetails,
  getShippingDetailsController,
  updateShippingDetails,
} from "../controllers/userController.js";
import {
  deleteCardController,
  fetchSavedCardsController,
  getPubKeyController,
  initPaymentSheetController,
  saveOrderInfo,
  saveOrderInfoListing,
  setDefaultCardController,
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
  getUserListingsController,
  updateListing,
} from "../controllers/marketplaceProductController.js";
import {
  addReviewListingController,
  getAllListingOrder,
  removeMyListController,
  sendUserBoughtListingController,
  updateOrderStatus,
} from "../controllers/listingsController.js";

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

router.post("/api/post/orderlisting", saveOrderInfoListing);
router.post("/api/get/orderlisting", getAllListingOrder);

router.get("/api/get/orderlisting/:id", sendUserBoughtListingController);
router.post("/api/post/updateStatus", updateOrderStatus);

router.post("/api/find/user", findUserByEmailController);

router.post("/api/add/wishlist", addToWishlistController);
router.post("/api/remove/wishlist", removeFromWishlistController);
router.post("/api/all/wishlist", getWishlistItemsController);

router.get("/api/all/listings", getListings);
router.post("/api/add/listings", addListing);
router.put("/listings/:id", updateListing);

router.delete("/api/remove/listings/:id", deleteListing);
router.get("/api/user_listings/:id", getUserListingsController);

router.post("/api/fetch-saved-cards", fetchSavedCardsController);
router.post("/delete-card", deleteCardController);
router.post("/set-default-card", setDefaultCardController);

router.post("/api/fetch-shipping", getShippingDetailsController);
router.post("/api/fetch-shipping-save", updateShippingDetails);

router.post("/api/add-shipping", updateShippingDetails);
router.get("/api/get/notfication/:id", getNotificationController);

router.post("/api/remove/deletemylisting",removeMyListController)

router.post("/api/add/review",addReviewListingController)
router.post("/api/get/review",removeMyListController)
export default router;
