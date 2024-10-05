import CategorySchema from "../model/CategorySchema.js";
import {v4 as uuid} from "uuid"

export const addCategoryController= async(req, res)=>{
    try {
        const { name, description, imageUrl } = req.body;

        if (!name || !description) {
          return res.status(400).json({ error: 'Name, description, and image are required' });
        }

        await CategorySchema.create({
          id: uuid(), 
          name,
          description,
          imageUrl,
        });     
    
        res.status(201).json({message: "Category Added"});
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
      }
}
export const getAllCategoryController= async(req, res)=>{

    try {
        const categories = await CategorySchema.find();
        res.status(200).json(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Server error' });
      }

}
export const updateCategoryController= async(req, res)=>{

}
export const deleteCategoryController= async(req, res)=>{

}