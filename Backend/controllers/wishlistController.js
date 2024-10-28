import ProductSchema from "../Model/ProductSchema.js";
import UsersSchema from "../model/UsersSchema.js";

export const addToWishlistController = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    // Find user and update their wishlist
    const user = await UsersSchema.findOneAndUpdate(
      { uid: user_id },
      { $addToSet: { wishlist: product_id } },
      { new: true }
    );

    // Find all products that are in the user's wishlist
    const wishlistProducts = await ProductSchema.find({
      id: { $in: user.wishlist },
    });

    // Send back the list of wishlisted products
    res.status(200).json({ wishlist: wishlistProducts });
  } catch (error) {
    console.error("Error updating wishlist:", error);
    res.status(500).json({ message: "Server error while updating wishlist." });
  }
};
export const removeFromWishlistController = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    // Remove product from wishlist
    const user = await UsersSchema.findOneAndUpdate(
      { uid: user_id },
      { $pull: { wishlist: product_id } },
      { new: true }
    );

    // Find the updated wishlist products
    const wishlistProducts = await ProductSchema.find({
      id: { $in: user.wishlist },
    });

    res.status(200).json({ wishlist: wishlistProducts });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res
      .status(500)
      .json({ message: "Server error while removing from wishlist." });
  }
};

export const getWishlistItemsController = async (req, res) => {
  const { user_id } = req.body;
  console.log(user_id);
  if (!user_id) {
    return res.status(400).json({ error: "User ID is required." });
  }
  try {
    const user = await UsersSchema.findOne({ uid: user_id });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    console.log(user.wishlist);

    const wishlistProducts = await ProductSchema.find({
      id: { $in: user.wishlist },
    });
    console.log(wishlistProducts);
    res.json({ wishlist: wishlistProducts });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Server error." });
  }
};
