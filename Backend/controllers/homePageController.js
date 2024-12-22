import ProductSchema from "../model/ProductSchema.js";
import CategorySchema from "../model/CategorySchema.js";
import UsersSchema from "../model/UsersSchema.js";

export const getHomePageData = async (req, res) => {
  try {
    const { user_id } = req.body;
    console.log(user_id);
    const user = await UsersSchema.findOne({ uid: user_id });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const products = await ProductSchema.find();
    const categories = await CategorySchema.find();
    res.status(200).json({ products, categories, wishlist: user.wishlist });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error" });
  }
};
