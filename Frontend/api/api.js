import axios from "axios";

const BASEURL = "http://192.168.1.3:3001";
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
export const uploadMarketplaceProductData = async (formData) => {
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
// export const uploadCategoryData = async (formData) => {
//   try {
//     const config = {
//       method: "post",
//       url: `${BASEURL}/api/upload/listings`,
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//       data: formData,
//     };
//     return axios(config);
//   } catch (error) {
//     console.log(error);
//   }
// };
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
    return await axios.post(`${BASEURL}/api/post/payment-sheet`, data);
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
export const saveTheOrderListing = async (data) => {
  try {
    return await axios.post(`${BASEURL}/api/post/orderlisting`, data);
  } catch (error) {
    console.log(error);
  }
};

export const getTheOrderListingBoughtApi = async (id) => {
  try {
    return await axios.get(`${BASEURL}/api/get/orderlisting/${id}`);
  } catch (error) {
    console.log(error);
  }
};
export const getNotificationUserApi = async (id) => {
  try {
    return await axios.get(`${BASEURL}/api/get/notfication/${id}`);
  } catch (error) {
    console.log(error);
  }
};
export const getListingsOrdersApi = async (data) => {
  try {
    return await axios.post(`${BASEURL}/api/get/orderlisting`, data);
  } catch (error) {
    console.log(error);
  }
};
export const updateListingsOrderStatusApi = async (data) => {
  try {
    return await axios.post(`${BASEURL}/api/post/updateStatus`, data);
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
export const getListings = async () => {
  return await axios.get(`${BASEURL}/api/all/listings`);
};

export const addListing = async (listing) => {
  return await axios.post(`${BASEURL}/api/add/listings`, listing);
};

export const updateListing = async (id, updatedData) => {
  return await axios.put(`${BASEURL}/listings/${id}`, updatedData);
};

export const deleteListing = async (id) => {
  return await axios.delete(`${BASEURL}/api/remove/listings/${id}`);
};
export const deleteCategory = async (id) => {
  return await axios.delete(`${BASEURL}/api/remove/categories/${id}`);
};

export const getUserListingsApi = async (id) => {
  return await axios.get(`${BASEURL}/api/user_listings/${id}`);
};
export const getSavedCards = async (data) => {
  return await axios.post(`${BASEURL}/api/fetch-saved-cards`, data);
};
export const getShippingDetailsApi = async (data) => {
  return await axios.post(`${BASEURL}/api/fetch-shipping`, data);
};

export const addOrUpdateShippingDetailsApi = async (data) => {
  return await axios.post(`${BASEURL}/api/fetch-shipping`, data);
};
