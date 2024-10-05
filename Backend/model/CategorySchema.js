// models/product.model.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const categorySchema = new Schema({
    id:{type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
});

const CategorySchema = model('Category', categorySchema);

export default CategorySchema;
