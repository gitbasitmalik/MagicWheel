// controllers/productController.js
import MarketplaceProduct from "../model/MarketplaceProductSchema.js";

// Get all listings
export const getListings = async (req, res) => {
  try {
    const listings = await MarketplaceProduct.find();

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new listing
export const addListing = async (req, res) => {
  console.log(req.body);
  const { name, description, price } = req.body;
  try {
    const product = new MarketplaceProduct({
      name,
      description,
      price,
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a listing
export const updateListing = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const product = await MarketplaceProduct.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a listing
export const deleteListing = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await MarketplaceProduct.findByIdAndDelete(id);
    res.status(200).json({ message: "Listing deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
