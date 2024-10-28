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
    itemsSold: { type: Number, required: false },
    totalItems: { type: Number, required: true },
    timestamp:{ type: String, required: true },
    onSale:{ type: Boolean, required: true },
    salePrice:{ type: Number, required: true },
    price:{ type: Number, required: true },
    reviews:{type:Array, required:false}
});

const ProductSchema = model('Product', productSchema);

export default ProductSchema;
