import axios from "axios";


export const uploadProductData = async(formData)=>{
try {
    const config = {
        method: 'post',
        url: `http://172.20.10.6:3001/api/upload/product`,
        headers: { 
          'Content-Type': 'multipart/form-data'
        },
        data : formData
      };
    return axios(config)
} catch (error) {
    console.log(error);
}
}
export const uploadCategoryData = async(formData)=>{
try {
    const config = {
        method: 'post',
        url: `http://172.20.10.6:3001/api/upload/category`,
        headers: { 
          'Content-Type': 'multipart/form-data'
        },
        data : formData
      };
    return axios(config)
} catch (error) {
    console.log(error);
}
}
export const getProductData = async()=>{
try {
    return axios.get("http://172.20.10.6:3001/api/get/products")
} catch (error) {
    console.log(error);
}
}
export const getCategoryData = async()=>{
try {
    return axios.get("http://172.20.10.6:3001/api/get/categories")
} catch (error) {
    console.log(error);
}
}