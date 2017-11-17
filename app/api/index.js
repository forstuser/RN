import axios from "axios";
import store from "../store";

const apiRequest = async ({ method, url, queryParams = {}, data = null }) => {
  try {
    const r = await axios.request({
      baseURL: "https://consumer.binbill.com",
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
