import axios from "axios";
import store from "../store";

export const API_BASE_URL = "https://consumer-eb.binbill.com";

const apiRequest = async ({ method, url, queryParams = {}, data = null }) => {
  try {
    const r = await axios.request({
      baseURL: API_BASE_URL,
      method,
      url,
      params: queryParams,
      data,
      headers: {
        Authorization: store.getState().loggedInUser.authToken
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

export const getProfileDetail = async () => {
  return await apiRequest({
    method: "get",
    url: "/consumer/profile"
  });
};

export const getProfileUpdate = async ({ name, email, location }) => {
  return await apiRequest({
    method: "put",
    url: "/consumer/profile",
    data: {
      name: name,
      email: email,
      location: location
    }
  });
};
