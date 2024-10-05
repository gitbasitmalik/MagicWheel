// models/product.model.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const productSchema = new Schema({
    id:{type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        id:  {type: String, required: true },
        name:  {type: String, required: true },
    },
    imageUrl: { type: String, required: true },
});

const ProductSchema = model('Product', productSchema);

export default ProductSchema;
