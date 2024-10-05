
import {v4 as uuid} from "uuid"
import ProductSchema from "../Model/ProductSchema.js";


export const addProductController = async (req, res) => {
    try {
      const { name, description, category, imageUrl } = req.body;
console.log(imageUrl);
  
      if (!name || !description) {
        return res.status(400).json({ error: 'Name, description, and image are required' });
      }
      await ProductSchema.create({
        id: uuid(), 
        name,
        description,
        category:{
            id:category.id,
            name:category.name,
        },
        imageUrl,
      });     
  
      res.status(201).json({message: "Products Added"});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
export const getAllProductController= async(req, res)=>{

        try {
          const products = await ProductSchema.find();
          res.status(200).json(products);
        } catch (error) {
          console.error('Error fetching products:', error);
          res.status(500).json({ error: 'Server error' });
        }

}
export const updateProductController= async(req, res)=>{

}
export const deleteProductController= async(req, res)=>{

}