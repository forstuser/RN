import axios from "axios";
import store from "../store";

export const API_BASE_URL = "https://consumer-eb.binbill.com";

const apiRequest = async ({
  method,
  url,
  queryParams = {},
  data = null,
  headers = {},
  onUploadProgress,
  onDownloadProgress,
  responseType = "json"
}) => {
  try {
    const token = store.getState().loggedInUser.authToken;
    if (token) {
      headers.Authorization = token;
    }
    const r = await axios.request({
      baseURL: API_BASE_URL,
      method,
      url,
      params: queryParams,
      data,
      headers,
      onUploadProgress,
      onDownloadProgress
    });
    if (r.data.status == false) {
      let error = new Error(r.data.message);
      error.statusCode = 400;
      throw error;
    }
    return r.data;
  } catch (e) {
    let error = new Error(e.message);
    error.statusCode = e.statusCode || 0;
    throw error;
  }
};

export const uploadDocuments = async (files, onUploadProgress) => {
  const data = new FormData();
  files.forEach((file, index) => {
    data.append(`filesName`, {
      uri: file.uri,
      type: file.mimeType,
      name: file.filename || "camera-image.jpeg"
    });
  });

  return await apiRequest({
    method: "post",
    url: "/consumer/upload",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress: progressEvent => {
      let percentCompleted = Math.floor(
        progressEvent.loaded * 100 / progressEvent.total
      );
      onUploadProgress(percentCompleted);
    }
  });
};

export const uploadProfilePic = async (file, onUploadProgress) => {
  const data = new FormData();
  data.append(`filesName`, {
    uri: file.uri,
    type: file.mimeType,
    name: file.filename || "profile-pic.jpeg"
  });

  return await apiRequest({
    method: "post",
    url: "/consumer/upload/selfie",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress: progressEvent => {
      let percentCompleted = Math.floor(
        progressEvent.loaded * 100 / progressEvent.total
      );
      onUploadProgress(percentCompleted);
    }
  });
};

export const fetchFile = async (url, onDownloadProgress) => {
  const responseData = await apiRequest({
    method: "get",
    url: url,
    responseType: "arraybuffer",
    onDownloadProgress
  });

  return new Buffer(responseData, "binary").toString("base64");
};

export const consumerGetOtp = async PhoneNo => {
  return await apiRequest({
    method: "post",
    url: "/consumer/getotp",
    data: { PhoneNo }
  });
};

export const consumerValidate = async (phoneNo, token, fcmToken) => {
  let data = {
    Token: token,
    TrueObject: { PhoneNo: phoneNo },
    BBLogin_Type: 1
  };
  if (fcmToken) {
    data.fcmId = fcmToken;
  }
  return await apiRequest({
    method: "post",
    url: "/consumer/validate",
    data
  });
};

export const addFcmToken = async fcmToken => {
  console.log("subscribe: ", fcmToken);
  return await apiRequest({
    method: "post",
    url: "/consumer/subscribe",
    data: {
      fcmId: fcmToken
    }
  });
};

export const consumerGetDashboard = async () => {
  return await apiRequest({
    method: "get",
    url: "/consumer/dashboard"
  });
};

export const consumerGetEhome = async () => {
  return await apiRequest({
    method: "get",
    url: "/consumer/ehome"
  });
};

export const getBrands = async () => {
  return await apiRequest({
    method: "get",
    url: "/brands"
  });
};

export const getCategories = async brandId => {
  return await apiRequest({
    method: "get",
    url: "/categories",
    queryParams: { brandid: brandId }
  });
};

export const getCategoryProducts = async ({
  categoryId,
  pageNo = 1,
  subCategoryId,
  categoryIds = [],
  brandIds = [],
  onlineSellerIds = [],
  offlineSellerIds = []
}) => {
  return await apiRequest({
    method: "get",
    url: `/categories/${categoryId}/products`,
    queryParams: {
      pageNo,
      subCategoryId,
      categoryids: "[" + categoryIds.join(",") + "]",
      brandids: "[" + brandIds.join(",") + "]",
      onlinesellerids: "[" + onlineSellerIds.join(",") + "]",
      offlinesellerids: "[" + offlineSellerIds.join(",") + "]"
    }
  });
};

export const getProductDetails = async productId => {
  return await apiRequest({
    method: "get",
    url: `/products/${productId}`
  });
};

export const getMailboxData = async pageNo => {
  return await apiRequest({
    method: "get",
    url: `/consumer/mailbox`,
    queryParams: {
      pageno: pageNo
    }
  });
};

export const getProfileDetail = async () => {
  return await apiRequest({
    method: "get",
    url: "/consumer/profile"
  });
};

export const getSearchResults = async searchValue => {
  return await apiRequest({
    method: "get",
    url: "/search",
    queryParams: {
      searchvalue: searchValue
    }
  });
};

export const getAscSearchResults = async ({
  categoryId,
  brandId,
  latitude,
  longitude
}) => {
  return await apiRequest({
    method: "post",
    url: "/consumer/servicecenters",
    data: {
      categoryId,
      brandId,
      latitude,
      longitude
    }
  });
};

export const updateProfile = async ({
  name,
  email,
  location,
  latitude,
  longitude
}) => {
  let data = {};
  if (name) data.name = name;
  if (email) data.email = email;
  if (location) data.location = location;
  if (latitude) data.latitude = latitude;
  if (longitude) data.longitude = longitude;
  return await apiRequest({
    method: "put",
    url: "/consumer/profile",
    data: data
  });
};

export const getInsightData = async () => {
  return await apiRequest({
    method: "get",
    url: "/insight"
  });
};

export const getCategoryInsightData = async id => {
  return await apiRequest({
    method: "get",
    url: `categories/${id}/insights`
  });
};

export const getReferenceDataCategories = async mainCategoryId => {
  const res = await apiRequest({
    method: "get",
    url: `/referencedata`,
    queryParams: {
      mainCategoryId
    }
  });

  return res.categories[0].subCategories;
};

export const getReferenceDataBrands = async categoryId => {
  const res = await apiRequest({
    method: "get",
    url: `/referencedata`,
    queryParams: {
      categoryId
    }
  });

  return res.categories[0].brands;
};

export const getReferenceDataModels = async (categoryId, brandId) => {
  const res = await apiRequest({
    method: "get",
    url: `/referencedata`,
    queryParams: {
      categoryId,
      brandId
    }
  });

  return res.dropDowns;
};

export const addProduct = async ({
  productName = "",
  mainCategoryId = null,
  categoryId = null,
  brandId = null,
  brandName = null,
  metadata = []
}) => {
  return await apiRequest({
    method: "post",
    url: `/products`,
    data: {
      product_name: productName,
      main_category_id: mainCategoryId,
      category_id: categoryId,
      brand_id: brandId,
      brand_name: brandName,
      metadata: metadata.map(meta => {
        return {
          category_form_id: meta.categoryFormId || null,
          form_value: meta.value || null,
          new_drop_down: meta.isNewValue || true
        };
      })
    }
  });
};

export const addProductReview = async ({
  productId,
  ratings = 0,
  feedback = null
}) => {
  return await apiRequest({
    method: "put",
    url: `products/${productId}/reviews`,
    data: {
      ratings,
      feedback
    }
  });
};

export const addSellerReview = async ({
  url,
  ratings = 0,
  feedback = null
}) => {
  return await apiRequest({
    method: "put",
    url: url,
    data: {
      ratings,
      feedback
    }
  });
};

export const getProductsForAsc = async () => {
  return await apiRequest({
    method: "get",
    url: `/center/products`
  });
};
