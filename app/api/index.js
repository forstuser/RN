import axios from "axios";
import store from "../store";

export const API_BASE_URL = "https://consumer-eb.binbill.com";

const apiRequest = async ({ method, url, queryParams = {}, data = null }) => {
  try {
    let headers = {};
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
      headers: {
        ...headers
      }
    });
    return r.data;
  } catch (e) {
    if (e.response) {
      throw new Error(e.response.data.message);
    } else {
      throw e.message;
    }
    throw e;
  }
};

export const uploadDocuments = async (files, onUploadProgress) => {
  try {
    let headers = {};
    const token = store.getState().loggedInUser.authToken;
    if (token) {
      headers.Authorization = token;
    }
    // create formdata
    const data = new FormData();
    files.forEach((file, index) => {
      data.append(`filesName`, {
        uri: file.uri,
        type: file.mimeType,
        name: file.filename || "camera-image.jpeg"
      });
    });

    const r = await axios.request({
      baseURL: API_BASE_URL,
      method: "post",
      url: "/consumer/upload",
      data: data,
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: progressEvent => {
        let percentCompleted = Math.floor(
          progressEvent.loaded * 100 / progressEvent.total
        );
        onUploadProgress(percentCompleted);
      }
    });
    return r.data;
  } catch (e) {
    if (e.response) {
      throw new Error(e.response.data.message);
    } else {
      throw e.message;
    }
    throw e;
  }
};

export const uploadProfilePic = async (file, onUploadProgress) => {
  try {
    let headers = {};
    const token = store.getState().loggedInUser.authToken;
    if (token) {
      headers.Authorization = token;
    }
    // create formdata
    const data = new FormData();
    data.append(`filesName`, {
      uri: file.uri,
      type: file.mimeType,
      name: file.filename
    });

    const r = await axios.request({
      baseURL: API_BASE_URL,
      method: "post",
      url: "/consumer/upload/selfie",
      data: data,
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: progressEvent => {
        let percentCompleted = Math.floor(
          progressEvent.loaded * 100 / progressEvent.total
        );
        onUploadProgress(percentCompleted);
      }
    });
    return r.data;
  } catch (e) {
    if (e.response) {
      throw new Error(e.response.data.message);
    } else {
      throw e.message;
    }
    throw e;
  }
};

export const consumerGetOtp = async PhoneNo => {
  return await apiRequest({
    method: "post",
    url: "/consumer/getotp",
    data: { PhoneNo }
  });
};

export const consumerValidate = async (PhoneNo, Token) => {
  return await apiRequest({
    method: "post",
    url: "/consumer/validate",
    data: {
      Token: Token,
      TrueObject: { PhoneNo: PhoneNo },
      BBLogin_Type: 1
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
