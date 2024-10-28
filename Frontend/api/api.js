import axios from "axios";

const BASEURL = "http://192.168.1.25:3001";
export const uploadProductData = async (formData) => {
  try {
    const config = {
      method: "post",
      url: `${BASEURL}/api/upload/product`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };
    return axios(config);
  } catch (error) {
    console.log(error);
  }
};
export const uploadCategoryData = async (formData) => {
  try {
    const config = {
      method: "post",
      url: `${BASEURL}/api/upload/category`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };
    return axios(config);
  } catch (error) {
    console.log(error);
  }
};
export const getProductData = async () => {
  try {
    return await axios.get(`${BASEURL}/api/get/products`);
  } catch (error) {
    console.log(error);
  }
};
export const getCategoryData = async () => {
  try {
    return await axios.get(`${BASEURL}/api/get/categories`);
  } catch (error) {
    console.log(error);
  }
};
export const getHomeData = async (data) => {
  try {
    return await axios.post(`${BASEURL}/api/get/home`, data);
  } catch (error) {
    console.log(error);
  }
};
export const addUser = async (data) => {
  try {
    return await axios.post(`${BASEURL}/api/add/user`, data);
  } catch (error) {
    console.log(error);
  }
};

export const fetchKey = async () => {
  try {
    return await axios.get(`${BASEURL}/api/get/pubkey`);
  } catch (error) {
    console.log(error);
  }
};
export const fetchPaymentSheetParams = async (data) => {
  try {
    return await axios.post(` ${BASEURL}/api/post/payment-sheet`, data);
  } catch (error) {
    console.log(error);
  }
};
export const saveTheOrder = async (data) => {
  try {
    return await axios.post(`${BASEURL}/api/post/order`, data);
  } catch (error) {
    console.log(error);
  }
};
export const findUserByEmail = async (data) => {
  try {
    return await axios.post(`${BASEURL}/api/find/user`, data);
  } catch (error) {
    console.log(error);
  }
};

export const addToWishlist = async (data) => {
  try {
    return await axios.post(`${BASEURL}/api/add/wishlist`, data);
  } catch (error) {
    console.log(error);
  }
};
export const removeFromWishlist = async (data) => {
  try {
    return await axios.post(`${BASEURL}/api/remove/wishlist`, data);
  } catch (error) {
    console.log(error);
  }
};
export const getWishlistItems = async (data) => {
  try {
    return await axios.post(`${BASEURL}/api/all/wishlist`, data);
  } catch (error) {
    console.log(error);
  }
};
