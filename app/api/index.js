import { Platform } from "react-native";
import axios from "axios";
import moment from "moment";
import store from "../store";
import DeviceInfo from "react-native-device-info";
import { SCREENS } from "../constants";
import NavigationService from "../navigation";
import { actions as uiActions } from "../modules/ui";
import { actions as loggedInUserActions } from "../modules/logged-in-user";
import Analytics from "../analytics";

let API_BASE_URL = "https://consumer-test.binbill.com";
if (!__DEV__) {
  API_BASE_URL = "https://consumer-test.binbill.com";
}
export { API_BASE_URL };

const APP_VERSION_FOR_API = 20009;

const platform = Platform.OS == "ios" ? 2 : 1;

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
    if (typeof token == "string") {
      headers.Authorization = token;
      console.log("auth token: ", token);
    }

    const language = store.getState().ui.language;
    if (language) {
      headers.language = language.code;
    }

    if (Platform.OS == "ios") {
      headers.ios_app_version = APP_VERSION_FOR_API; //DeviceInfo.getBuildNumber();
    } else {
      headers.app_version = APP_VERSION_FOR_API; //android app version
    }

    console.log(
      "New Request: ",
      method,
      API_BASE_URL + url,
      "headers: ",
      headers,
      "data: ",
      data,
      "queryParams: ",
      queryParams
    );

    const r = await axios.request({
      baseURL: API_BASE_URL,
      method,
      url,
      params: queryParams,
      data,
      headers,
      onUploadProgress,
      onDownloadProgress,
      timeout: 3600 * 1000 //3600 seconds
    });
    console.log("r.data: ", r.data);
    // NavigationService.navigate(SCREENS.FORCE_UPDATE_SCREEN, {
    //   allowSkip: true
    // });

    const appUpdateAvailableScreenTimestamp = store.getState().ui
      .appUpdateAvailableScreenTimestamp;

    if (r.data.forceUpdate === true) {
      NavigationService.navigate(SCREENS.FORCE_UPDATE_SCREEN);
    } else if (
      r.data.forceUpdate === false &&
      (!appUpdateAvailableScreenTimestamp ||
        moment().diff(
          moment(appUpdateAvailableScreenTimestamp).startOf("day"),
          "days"
        ) > 7)
    ) {
      store.dispatch(
        uiActions.setAppUpdateAvailableScreenTimestamp(new Date().toISOString())
      );
      NavigationService.navigate(SCREENS.FORCE_UPDATE_SCREEN, {
        allowSkip: true
      });
    }

    if (r.data.status == false) {
      let error = new Error(r.data.message);
      error.originalMessage = r.data.message;
      error.statusCode = 400;
      throw error;
    }

    return r.data;
  } catch (e) {
    console.log("e: ", e);
    let error = new Error(
      e.originalMessage || "Something went wrong, please try again!"
    );
    error.statusCode = e.statusCode || 0;

    if (error.statusCode == 0) {
      error.message = "Please check internet connection";
    }

    if (e.response) {
      console.log("e.response.data: ", e.response.data);
      error.statusCode = e.response.status;
      error.message = e.response.data.message;
    }

    if (error.statusCode != 401 && error.statusCode != 402) {
      Analytics.logEvent(
        Analytics.EVENTS.API_ERROR + `${url.replace(/\//g, "_")}`,
        { message: error.message, statusCode: error.statusCode }
      );
    }

    if (error.statusCode == 401) {
      store.dispatch(loggedInUserActions.loggedInUserClearAllData());
      NavigationService.navigate(SCREENS.AUTH_STACK);
    } else if (error.statusCode == 402) {
      error.message = "";
      NavigationService.navigate(SCREENS.ENTER_PIN_POPUP_SCREEN);
    }
    throw error;
  }
};

export const uploadDocuments = async ({
  productId = null,
  jobId = null,
  type = null,
  itemId,
  files,
  onUploadProgress = () => { }
}) => {
  const data = new FormData();
  files.forEach((file, index) => {
    data.append(`filesName`, {
      uri: file.uri,
      type: file.mimeType,
      name: file.filename || "camera-image.jpeg"
    });
  });

  let url = "/consumer/upload";
  if (jobId) {
    url = url + "/" + jobId;
  }
  let queryParams = {};
  if (type) {
    queryParams.type = type;
  }

  if (itemId) {
    queryParams.itemid = itemId;
  }

  if (productId) {
    queryParams.productid = productId;
  }

  return await apiRequest({
    method: "post",
    url,
    queryParams,
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress: progressEvent => {
      let percentCompleted = Math.floor(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onUploadProgress(percentCompleted);
    }
  });
};

export const getNewAppVersionDetails = async () => {
  return await apiRequest({
    method: "get",
    url: `/version/detail`
  });
};

export const deleteBill = async (jobId, billId) => {
  return await apiRequest({
    method: "delete",
    url: `/jobs/${jobId}/files/${billId}`
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
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onUploadProgress(percentCompleted);
    }
  });
};

export const uploadProductImage = async (productId, file, onUploadProgress) => {
  const data = new FormData();
  data.append(`filesName`, {
    uri: file.uri,
    type: file.mimeType,
    name: file.filename || "product-image.jpeg"
  });

  return await apiRequest({
    method: "post",
    url: `consumer/products/${productId}/images`,
    data: data,
    headers: {
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress: progressEvent => {
      let percentCompleted = Math.floor(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onUploadProgress(percentCompleted);
    }
  });
};

export const verifyEmail = async verificationId => {
  return await apiRequest({
    method: "get",
    url: `/verify/${verificationId}`
  });
};

export const consumerGetOtp = async PhoneNo => {
  return await apiRequest({
    method: "post",
    url: "/consumer/getotp",
    data: { PhoneNo }
  });
};

export const updatePhoneNumber = async ({ phone, otp }) => {
  let data = {
    mobile_no: phone,
    token: otp
  };
  return await apiRequest({
    method: "put",
    url: "/consumer/validate",
    data
  });
};

export const consumerValidate = async ({
  phoneNo,
  token,
  fcmToken,
  trueSecret,
  trueObject,
  bbLoginType = 1
}) => {
  let data = {
    Token: token,
    TrueSecret: trueSecret,
    TrueObject: trueObject,
    BBLogin_Type: bbLoginType,
    platform: platform
  };
  if (fcmToken) {
    data.fcmId = fcmToken;
  }
  return await apiRequest({
    method: "post",
    url: "/consumer/validate",
    data: JSON.parse(JSON.stringify(data))
  });
};

export const addFcmToken = async fcmToken => {
  console.log("subscribe: ", fcmToken);

  const token = store.getState().loggedInUser.authToken;
  if (token) {
    return await apiRequest({
      method: "post",
      url: "/consumer/subscribe",
      data: {
        fcmId: fcmToken,
        platform: platform
      }
    });
  } else {
    return new Error("User not logged in yet");
  }
};

export const logout = async fcmToken => {
  return await apiRequest({
    method: "post",
    url: "/consumer/logout",
    data: {
      fcmId: store.getState().ui.fcmToken,
      platform: platform
    }
  });
};

export const ascAccessed = async () => {
  return await apiRequest({
    method: "put",
    url: "/service/centers/accessed"
  });
};

export const getTips = async () => {
  return await apiRequest({
    method: "get",
    url: "/tips"
  });
};

export const getFaqs = async () => {
  return await apiRequest({
    method: "get",
    url: "/faqs"
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

export const updateMailboxRead = async (notificationIds = []) => {
  return await apiRequest({
    method: "post",
    url: `/consumer/mailbox/read`,
    data: {
      notificationIds
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
  phone,
  location,
  latitude,
  longitude,
  gender
}) => {
  let data = {};
  if (name) data.name = name;
  if (email) data.email = email;
  if (phone) data.mobile_no = phone;
  if (gender) data.gender = gender;
  if (location) data.location = location;
  if (latitude) data.latitude = latitude;
  if (longitude) data.longitude = longitude;
  return await apiRequest({
    method: "put",
    url: "/consumer/profile",
    data: data
  });
};

export const getInsightData = async ({ forMonth, forYear, forLifetime }) => {
  return await apiRequest({
    method: "get",
    url: "/insight",
    queryParams: {
      for_month: forMonth,
      for_year: forYear,
      for_lifetime: forLifetime
    }
  });
};

export const getCategoryInsightData = async ({
  categoryId,
  forMonth,
  forYear,
  forLifetime
}) => {
  return await apiRequest({
    method: "get",
    url: `categories/${categoryId}/insights`,
    queryParams: {
      for_month: forMonth,
      for_year: forYear,
      for_lifetime: forLifetime
    }
  });
};

export const getReferenceData = async () => {
  const res = await apiRequest({
    method: "get",
    url: `/referencedata`
  });

  return res;
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

export const getReferenceDataForCategory = async categoryId => {
  console.log("s", categoryId);
  return await apiRequest({
    method: "get",
    url: `/referencedata`,
    queryParams: {
      categoryId
    }
  });
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

export const getAccessoriesReferenceDataForCategory = async categoryId => {
  return await apiRequest({
    method: "get",
    url: `/referencedata/accessories`,
    queryParams: {
      category_id: categoryId
    }
  });
};

export const addProduct = async ({
  productName = "",
  mainCategoryId = undefined,
  categoryId = undefined,
  brandId = undefined,
  brandName = undefined,
  purchaseCost = undefined,
  purchaseDate = undefined,
  metadata = []
}) => {
  let data = {
    product_name: productName,
    main_category_id: mainCategoryId,
    category_id: categoryId,
    brand_id: brandId,
    brand_name: brandName,
    purchase_cost: purchaseCost,
    document_date: purchaseDate,
    metadata: metadata.map(meta => {
      return {
        category_form_id: meta.categoryFormId || undefined,
        form_value: meta.value || undefined,
        new_drop_down: meta.isNewValue || true
      };
    })
  };

  return await apiRequest({
    method: "post",
    url: `/products`,
    data
  });
};

export const updateProduct = async ({
  productId,
  productName,
  mainCategoryId,
  categoryId,
  subCategoryId,
  sellerName,
  sellerContact,
  sellerEmail,
  sellerAddress,
  brandId,
  brandName,
  model,
  isNewModel,
  value,
  purchaseDate,
  metadata = [],
  warranty,
  insurance,
  amc,
  repair,
  puc
}) => {
  let data = {
    product_name: productName,
    main_category_id: mainCategoryId,
    category_id: categoryId,
    sub_category_id: subCategoryId,
    brand_id: brandId,
    brand_name: brandName,
    value: value || 0,
    document_date: purchaseDate,
    seller_name: sellerName,
    seller_contact: sellerContact,
    seller_email: sellerEmail,
    seller_address: sellerAddress,
    model: model,
    isNewModel: isNewModel
  };

  if (metadata.length > 0) {
    data.metadata = metadata.map(meta => {
      return {
        id: meta.id || undefined,
        category_form_id: meta.categoryFormId || undefined,
        form_value: meta.value,
        new_drop_down: meta.isNewValue
      };
    });
  }

  if (warranty && purchaseDate && warranty.renewalType) {
    data.warranty = {
      renewal_type: warranty.renewalType || undefined,
      id: warranty.id || undefined,
      effective_date: purchaseDate || undefined,
      dual_id: warranty.dualId || undefined,
      dual_renewal_type: warranty.dualRenewalType || undefined,
      extended_id: warranty.extendedId || undefined,
      extended_provider_id: warranty.extendedProviderId || undefined,
      extended_provider_name: warranty.extendedProviderName || undefined,
      extended_renewal_type: warranty.extendedRenewalType || undefined,
      extended_effective_date: warranty.extendedRenewalType || undefined
    };
  }

  if (insurance && (insurance.providerId || insurance.providerName)) {
    data.insurance = {
      id: insurance.id || undefined,
      effective_date: insurance.effectiveDate || undefined,
      provider_id: insurance.providerId || undefined,
      provider_name: insurance.providerName || undefined,
      policy_no: insurance.policyNo || undefined,
      value: insurance.value || undefined,
      amount_insured: insurance.amountInsured || undefined
    };
  }

  if (
    amc &&
    (amc.id ||
      amc.sellerName ||
      amc.sellerContact ||
      amc.value ||
      amc.effectiveDate)
  ) {
    data.amc = {
      id: amc.id || undefined,
      seller_name: amc.sellerName || undefined,
      seller_contact: amc.sellerContact || undefined,
      value: amc.value || undefined,
      effective_date: amc.effectiveDate || undefined
    };
  }

  if (
    puc &&
    (puc.id ||
      puc.sellerName ||
      puc.sellerContact ||
      puc.value ||
      puc.effectiveDate ||
      puc.expiryPeriod)
  ) {
    data.puc = {
      id: puc.id || undefined,
      seller_name: puc.sellerName || undefined,
      seller_contact: puc.sellerContact || undefined,
      value: puc.value || undefined,
      effective_date: puc.effectiveDate || undefined,
      expiry_period: puc.expiryPeriod || undefined
    };
  }

  if (
    repair &&
    (repair.id ||
      repair.sellerName ||
      (repair.sellerContact &&
        repair.value &&
        repair.repairFor &&
        repair.warrantyUpto &&
        repair.repairDate))
  ) {
    data.repair = {
      id: repair.id || undefined,
      seller_name: repair.sellerName || undefined,
      seller_contact: repair.sellerContact || undefined,
      value: repair.value || undefined,
      repair_for: repair.repairFor || undefined,
      warranty_upto: repair.warrantyUpto || undefined,
      document_date: repair.repairDate || undefined
    };
  }

  console.log(JSON.stringify(data));

  return await apiRequest({
    method: "put",
    url: `/products/${productId}`,
    data: JSON.parse(JSON.stringify(data)) //to remove undefined keys
  });
};

export const addProductReview = async ({
  productId,
  ratings = 0,
  feedback = null
}) => {
  return await apiRequest({
    method: "put",
    url: `/products/${productId}/reviews`,
    data: {
      ratings,
      feedback
    }
  });
};

export const addSellerReview = async ({
  sellerId,
  ratings = 0,
  feedback = null,
  orderId = null
}) => {
  return await apiRequest({
    method: "put",
    url: `/sellers/${sellerId}/reviews`,
    data: {
      ratings,
      feedback,
      order_id: orderId
    }
  });
};

export const addAssistedServiceReview = async ({
  id,
  sellerId,
  ratings = 0,
  feedback = null,
  orderId = null
}) => {
  return await apiRequest({
    method: "put",
    url: `/sellers/${sellerId}/assisted/${id}/reviews`,
    data: {
      ratings,
      feedback,
      order_id: orderId
    }
  });
};

export const getProductsForAsc = async () => {
  return await apiRequest({
    method: "get",
    url: `/center/products`
  });
};

export const initProduct = async (
  mainCategoryId,
  categoryId,
  subCategoryId
) => {
  return await apiRequest({
    method: "post",
    url: "/products/init",
    data: {
      main_category_id: mainCategoryId,
      category_id: categoryId,
      sub_category_id: subCategoryId
    }
  });
};

export const initExpense = async (mainCategoryId, categoryId) => {
  return await apiRequest({
    method: "post",
    url: "/expenses/init",
    data: {
      main_category_id: mainCategoryId,
      category_id: categoryId
    }
  });
};

export const updateExpense = async ({
  productId,
  value,
  sellerId,
  documentDate,
  digitallyVerified,
  homeDelivered,
  isComplete
}) => {
  const data = {
    value: value,
    seller_id: sellerId,
    document_date: documentDate,
    digitally_verified: digitallyVerified,
    home_delivered: homeDelivered,
    is_complete: isComplete
  };

  return await apiRequest({
    method: "put",
    url: `/expenses/${productId}`,
    data: JSON.parse(JSON.stringify(data))
  });
};

export const linkSkusWithExpense = async ({ productId, jobId, skuItems }) => {
  return await apiRequest({
    method: "post",
    url: `/expenses/${productId}/sku`,
    data: {
      job_id: jobId,
      sku_items: skuItems
    }
  });
};

export const deleteProduct = async id => {
  return await apiRequest({
    method: "delete",
    url: `/products/${id}`
  });
};

export const getRepairableProducts = async () => {
  return await apiRequest({
    method: "get",
    url: "/repairs/products"
  });
};

export const updateRepair = async ({
  id,
  productId,
  repairFor,
  repairDate,
  sellerName,
  sellerContact,
  value,
  warrantyUpto
}) => {
  let data = {
    document_date: repairDate || undefined,
    repair_for: repairFor || undefined,
    seller_name: sellerName || undefined,
    seller_contact: sellerContact || undefined,
    value: value || undefined,
    warranty_upto: warrantyUpto || undefined
  };

  return await apiRequest({
    method: "put",
    url: `/products/${productId}/repairs/${id}`,
    data: JSON.parse(JSON.stringify(data)) //to remove undefined keys
  });
};

export const addRepair = async ({
  productId,
  repairFor,
  repairDate,
  sellerName,
  sellerContact,
  value,
  warrantyUpto
}) => {
  let data = {
    document_date: repairDate || undefined,
    repair_for: repairFor || undefined,
    seller_name: sellerName || undefined,
    seller_contact: sellerContact || undefined,
    value: value || undefined,
    warranty_upto: warrantyUpto || undefined
  };

  return await apiRequest({
    method: "post",
    url: `/products/${productId}/repairs`,
    data: JSON.parse(JSON.stringify(data)) //to remove undefined keys
  });
};

export const deleteRepair = async ({ productId, repairId }) => {
  return await apiRequest({
    method: "delete",
    url: `/products/${productId}/repairs/${repairId}`
  });
};

export const updateWarranty = async ({
  id,
  productId,
  jobId,
  providerId,
  providerName,
  renewalType,
  effectiveDate,
  warrantyType,
  value,
  mainCategoryId,
  categoryId
}) => {
  let data = {
    job_id: jobId || undefined,
    provider_id: providerId || undefined,
    provider_name: providerName || undefined,
    renewal_type: renewalType || undefined,
    effective_date: effectiveDate || undefined,
    warranty_type: warrantyType || undefined,
    value: value || undefined,
    main_category_id: mainCategoryId || undefined,
    category_id: categoryId || undefined
  };

  return await apiRequest({
    method: "put",
    url: `/products/${productId}/warranties/${id}`,
    data: JSON.parse(JSON.stringify(data)) //to remove undefined keys
  });
};

export const addWarranty = async ({
  productId,
  jobId,
  providerId,
  providerName,
  renewalType,
  effectiveDate,
  warrantyType,
  value,
  mainCategoryId,
  categoryId
}) => {
  let data = {
    job_id: jobId || undefined,
    provider_id: providerId || undefined,
    provider_name: providerName || undefined,
    renewal_type: renewalType || undefined,
    effective_date: effectiveDate || undefined,
    warranty_type: warrantyType || undefined,
    value: value || undefined,
    main_category_id: mainCategoryId || undefined,
    category_id: categoryId || undefined
  };

  return await apiRequest({
    method: "post",
    url: `/products/${productId}/warranties`,
    data: JSON.parse(JSON.stringify(data)) //to remove undefined keys
  });
};

export const deleteWarranty = async ({ productId, warrantyId }) => {
  return await apiRequest({
    method: "delete",
    url: `/products/${productId}/warranties/${warrantyId}`
  });
};

export const updateInsurance = async ({
  id,
  productId,
  jobId,
  providerId,
  providerName,
  effectiveDate,
  policyNo,
  value,
  amountInsured,
  mainCategoryId,
  categoryId
}) => {
  let data = {
    job_id: jobId || undefined,
    provider_id: providerId || undefined,
    provider_name: providerName || undefined,
    effective_date: effectiveDate || undefined,
    policy_no: policyNo || undefined,
    value: value || undefined,
    amount_insured: amountInsured || undefined,
    main_category_id: mainCategoryId || undefined,
    category_id: categoryId || undefined
  };

  return await apiRequest({
    method: "put",
    url: `/products/${productId}/insurances/${id}`,
    data: JSON.parse(JSON.stringify(data)) //to remove undefined keys
  });
};

export const addInsurance = async ({
  productId,
  jobId,
  providerId,
  providerName,
  effectiveDate,
  policyNo,
  value,
  amountInsured,
  mainCategoryId,
  categoryId
}) => {
  let data = {
    job_id: jobId || undefined,
    provider_id: providerId || undefined,
    provider_name: providerName || undefined,
    effective_date: effectiveDate || undefined,
    policy_no: policyNo || undefined,
    value: value || undefined,
    amount_insured: amountInsured || undefined,
    main_category_id: mainCategoryId || undefined,
    category_id: categoryId || undefined
  };

  return await apiRequest({
    method: "post",
    url: `/products/${productId}/insurances`,
    data: JSON.parse(JSON.stringify(data)) //to remove undefined keys
  });
};

export const deleteInsurance = async ({ productId, insuranceId }) => {
  return await apiRequest({
    method: "delete",
    url: `/products/${productId}/insurances/${insuranceId}`
  });
};

export const updateAmc = async ({
  id,
  productId,
  jobId,
  effectiveDate,
  value,
  sellerName,
  sellerContact
}) => {
  let data = {
    job_id: jobId || undefined,
    effective_date: effectiveDate || undefined,
    value: value || undefined,
    seller_name: sellerName || undefined,
    seller_contact: sellerContact || undefined
  };

  return await apiRequest({
    method: "put",
    url: `/products/${productId}/amcs/${id}`,
    data: JSON.parse(JSON.stringify(data)) //to remove undefined keys
  });
};

export const addAmc = async ({
  productId,
  jobId,
  effectiveDate,
  value,
  sellerName,
  sellerContact
}) => {
  let data = {
    job_id: jobId,
    effective_date: effectiveDate || undefined,
    value: value || undefined,
    seller_name: sellerName || undefined,
    seller_contact: sellerContact || undefined
  };

  return await apiRequest({
    method: "post",
    url: `/products/${productId}/amcs`,
    data: JSON.parse(JSON.stringify(data)) //to remove undefined keys
  });
};

export const deleteAmc = async ({ productId, amcId }) => {
  return await apiRequest({
    method: "delete",
    url: `/products/${productId}/amcs/${amcId}`
  });
};

export const updatePuc = async ({
  id,
  productId,
  jobId,
  effectiveDate,
  value,
  sellerName,
  sellerContact,
  expiryPeriod
}) => {
  let data = {
    job_id: jobId,
    effective_date: effectiveDate || undefined,
    value: value || undefined,
    seller_name: sellerName || undefined,
    seller_contact: sellerContact || undefined,
    expiry_period: expiryPeriod || undefined
  };

  return await apiRequest({
    method: "put",
    url: `/products/${productId}/pucs/${id}`,
    data: JSON.parse(JSON.stringify(data)) //to remove undefined keys
  });
};

export const addPuc = async ({
  productId,
  jobId,
  effectiveDate,
  value,
  sellerName,
  sellerContact,
  expiryPeriod
}) => {
  let data = {
    job_id: jobId || undefined,
    effective_date: effectiveDate || undefined,
    value: value || undefined,
    seller_name: sellerName || undefined,
    seller_contact: sellerContact || undefined,
    expiry_period: expiryPeriod || undefined
  };

  return await apiRequest({
    method: "post",
    url: `/products/${productId}/pucs`,
    data: JSON.parse(JSON.stringify(data)) //to remove undefined keys
  });
};

export const deletePuc = async ({ productId, pucId }) => {
  return await apiRequest({
    method: "delete",
    url: `/products/${productId}/pucs/${pucId}`
  });
};

export const updateRc = async ({
  id,
  productId,
  jobId,
  effectiveDate,
  renewalType,
  rcNumber,
  stateId
}) => {
  let data = {
    job_id: jobId,
    effective_date: effectiveDate || undefined,
    renewal_type: renewalType || undefined,
    document_number: rcNumber || undefined,
    state_id: stateId || undefined
  };

  return await apiRequest({
    method: "put",
    url: `/products/${productId}/rc/${id}`,
    data: JSON.parse(JSON.stringify(data)) //to remove undefined keys
  });
};

export const addRc = async ({
  productId,
  jobId,
  effectiveDate,
  renewalType,
  rcNumber,
  stateId
}) => {
  let data = {
    job_id: jobId,
    effective_date: effectiveDate || undefined,
    renewal_type: renewalType || undefined,
    document_number: rcNumber || undefined,
    state_id: stateId || undefined
  };

  return await apiRequest({
    method: "post",
    url: `/products/${productId}/rc`,
    data: JSON.parse(JSON.stringify(data)) //to remove undefined keys
  });
};

export const deleteRc = async ({ productId, rcId }) => {
  return await apiRequest({
    method: "delete",
    url: `/products/${productId}/rc/${rcId}`
  });
};

export const updateAccessory = async ({
  id,
  productId,
  jobId,
  accessoryPartId,
  accessoryPartName,
  purchaseDate,
  value,
  warrantyId,
  warrantyRenewalType,
  warrantyEffectiveDate,
  mainCategoryId,
  categoryId
}) => {
  let data = {
    job_id: jobId || undefined,
    accessory_part_id: accessoryPartId || undefined,
    accessory_part_name: accessoryPartName || undefined,
    document_date: purchaseDate || undefined,
    value: value || undefined,
    warranty: warrantyRenewalType
      ? {
        id: warrantyId || undefined,
        renewal_type: warrantyRenewalType || undefined,
        effective_date: warrantyEffectiveDate || undefined
      }
      : {},
    main_category_id: mainCategoryId || undefined,
    category_id: categoryId || undefined
  };

  return await apiRequest({
    method: "put",
    url: `/products/${productId}/accessories/${id}`,
    data: JSON.parse(JSON.stringify(data)) //to remove undefined keys
  });
};

export const addAccessory = async ({
  productId,
  jobId,
  accessoryPartId,
  accessoryPartName,
  purchaseDate,
  value,
  warrantyId,
  warrantyRenewalType,
  warrantyEffectiveDate,
  mainCategoryId,
  categoryId
}) => {
  let data = {
    job_id: jobId || undefined,
    accessory_part_id: accessoryPartId || undefined,
    accessory_part_name: accessoryPartName || undefined,
    document_date: purchaseDate || undefined,
    value: value || undefined,
    warranty: warrantyRenewalType
      ? {
        id: warrantyId || undefined,
        renewal_type: warrantyRenewalType || undefined,
        effective_date: warrantyEffectiveDate || undefined
      }
      : {},
    main_category_id: mainCategoryId || undefined,
    category_id: categoryId || undefined
  };

  return await apiRequest({
    method: "post",
    url: `/products/${productId}/accessories`,
    data: JSON.parse(JSON.stringify(data)) //to remove undefined keys
  });
};

export const fetchDoYouKnowItems = async ({ tagIds, offsetId }) => {
  let queryParams = {};
  if (offsetId) {
    queryParams.offset = offsetId;
  }
  return await apiRequest({
    method: "post",
    url: "/know/items",
    data: { tag_id: tagIds },
    queryParams
  });
};

export const fetchDoYouKnowItem = async id => {
  return await apiRequest({
    method: "get",
    url: `/know/items/${id}`
  });
};

export const fetchDoYouKnowTags = async () => {
  return await apiRequest({
    method: "get",
    url: "/tags"
  });
};

export const likeDoYouKnowItem = async ({ itemId }) => {
  return await apiRequest({
    method: "put",
    url: `/know/items/${itemId}`
  });
};

export const unlikeDoYouKnowItem = async ({ itemId }) => {
  return await apiRequest({
    method: "delete",
    url: `/know/items/${itemId}`
  });
};

export const fetchCalendarItems = async () => {
  return await apiRequest({
    method: "get",
    url: "/calendar/items"
  });
};

export const createCalendarItem = async ({
  serviceTypeId,
  productName,
  providerName,
  providerNumber,
  wagesType,
  selectedDays,
  unitPrice,
  unitType,
  quantity,
  effectiveDate
}) => {
  const data = {
    product_name: productName || undefined,
    provider_name: providerName || undefined,
    provider_number: providerNumber || undefined,
    wages_type: wagesType || undefined,
    selected_days: selectedDays || undefined,
    unit_price: unitPrice || 0,
    unit_type: unitType || undefined,
    quantity: quantity,
    effective_date: effectiveDate || undefined
  };
  return await apiRequest({
    method: "post",
    url: `/calendar/${serviceTypeId}/items`,
    data: JSON.parse(JSON.stringify(data))
  });
};

export const updateCalendarItem = async ({
  itemId,
  productName,
  providerName,
  providerNumber
}) => {
  console.log("pro", providerNumber);
  return await apiRequest({
    method: "put",
    url: `/calendar/items/${itemId}`,
    data: {
      product_name: productName || "",
      provider_name: providerName || "",
      provider_number: providerNumber || ""
    }
  });
};

export const deleteCalendarItem = async id => {
  return await apiRequest({
    method: "delete",
    url: `/calendar/items/${id}`
  });
};

export const addCalendarItemCalculationDetail = async ({
  itemId,
  selectedDays,
  unitPrice,
  unitType,
  quantity,
  effectiveDate
}) => {
  const data = {
    selected_days: selectedDays || undefined,
    unit_price: unitPrice || 0,
    unit_type: unitType || undefined,
    quantity: quantity,
    effective_date: effectiveDate || undefined
  };
  return await apiRequest({
    method: "post",
    url: `/calendar/items/${itemId}/calc`,
    data: JSON.parse(JSON.stringify(data))
  });
};

export const fetchCalendarItemById = async id => {
  return await apiRequest({
    method: "get",
    url: `/calendar/items/${id}`
  });
};

export const fetchCalendarReferenceData = async () => {
  return await apiRequest({
    method: "get",
    url: "/calendar/referencedata"
  });
};

export const updateCalendarServicePaymentDayToAbsent = async ({
  itemId,
  paymentId,
  date
}) => {
  return await apiRequest({
    method: "put",
    url: `/calendar/items/${itemId}/payments/${paymentId}/absent`,
    data: {
      absent_date: date
    }
  });
};

export const updateCalendarServicePaymentDayToPresent = async ({
  itemId,
  paymentId,
  date
}) => {
  return await apiRequest({
    method: "put",
    url: `/calendar/items/${itemId}/payments/${paymentId}/present`,
    data: {
      present_date: date
    }
  });
};

export const addCalendarItemPayment = async ({
  itemId,
  amountPaid,
  paidOn
}) => {
  return await apiRequest({
    method: "put",
    url: `/calendar/items/${itemId}/paid`,
    data: {
      amount_paid: amountPaid,
      paid_on: paidOn
    }
  });
};

export const setCalendarItemFinishDate = async ({ itemId, finishDate }) => {
  return await apiRequest({
    method: "put",
    url: `/calendar/items/${itemId}/finish`,
    data: {
      end_date: finishDate
    }
  });
};

export const verifyPin = async ({ pin }) => {
  return await apiRequest({
    method: "post",
    url: `/consumer/pin`,
    data: {
      pin
    }
  });
};

export const setPin = async ({ pin }) => {
  return await apiRequest({
    method: "post",
    url: `/consumer/pin/reset`,
    data: {
      pin
    }
  });
};

export const deletePin = async ({ pin }) => {
  return await apiRequest({
    method: "delete",
    url: `/consumer/pin`,
    data: {
      pin
    }
  });
};

export const askOtpOnEmail = async ({ email }) => {
  return await apiRequest({
    method: "post",
    url: `/consumer/otp/send`,
    data: {
      email
    }
  });
};

export const validateEmailOtp = async ({ otp }) => {
  return await apiRequest({
    method: "post",
    url: `/consumer/otp/validate`,
    data: {
      token: otp
    }
  });
};

export const fetchStates = async () => {
  return await apiRequest({
    method: "get",
    url: `/states`
  });
};

export const fetchStateMeals = async ({ stateId, isVeg }) => {
  return await apiRequest({
    method: "get",
    url: `/states/${stateId}/meals`,
    queryParams: {
      is_veg: isVeg || undefined
    }
  });
};

export const removeMealById = async ({ mealId }) => {
  console.log(mealId);
  return await apiRequest({
    method: "delete",
    url: `/user/meals/${mealId}/remove`
  });
};

export const removeTodoById = async ({ todoId }) => {
  return await apiRequest({
    method: "delete",
    url: `/user/todos/${todoId}/remove`
  });
};

export const removeClothById = async ({ clothId }) => {
  return await apiRequest({
    method: "delete",
    url: `/wearables/${clothId}`
  });
};

export const saveMealList = async ({ selectedItemIds, selectedState }) => {
  return await apiRequest({
    method: "post",
    url: "/user/meals",
    data: {
      selected_ids: selectedItemIds,
      state_id: selectedState
    }
  });
};

export const saveTodoList = async ({ selectedItemIds }) => {
  return await apiRequest({
    method: "post",
    url: "/user/todos",
    data: {
      selected_ids: selectedItemIds
    }
  });
};

export const getMealListByDate = async date => {
  return await apiRequest({
    method: "get",
    url: `/user/meals?current_date=${date}`
  });
};

export const addMealForADate = async ({ mealId, date }) => {
  return await apiRequest({
    method: "put",
    url: `/user/meals/${mealId}`,
    data: {
      current_date: date
    }
  });
};

export const addTodoForADate = async ({ todoId, date }) => {
  return await apiRequest({
    method: "put",
    url: `/user/todos/${todoId}`,
    data: {
      current_date: date
    }
  });
};

export const addClothForADate = async ({ clothId, date }) => {
  return await apiRequest({
    method: "put",
    url: `/user/wearables/${clothId}`,
    data: {
      current_date: date
    }
  });
};

export const removeMealForADate = async ({ mealId, date }) => {
  return await apiRequest({
    method: "delete",
    url: `/user/meals/${mealId}`,
    data: {
      current_date: date
    }
  });
};

export const removeTodoForADate = async ({ todoId, date }) => {
  return await apiRequest({
    method: "delete",
    url: `/user/todos/${todoId}`,
    data: {
      current_date: date
    }
  });
};

export const removeClothForADate = async ({ clothId, date }) => {
  return await apiRequest({
    method: "delete",
    url: `/user/wearables/${clothId}`,
    data: {
      current_date: date
    }
  });
};

export const addUserCreatedMeals = async ({ meals, stateId, date }) => {
  return await apiRequest({
    method: "post",
    url: `/user/meals/add`,
    data: {
      names: meals,
      state_id: stateId,
      current_date: date
    }
  });
};

export const fetchAllTodos = async () => {
  return await apiRequest({
    method: "get",
    url: `/todos`
  });
};

export const fetchAllCloths = async () => {
  return await apiRequest({
    method: "get",
    url: `/todos`
  });
};

export const getTodoListByDate = async date => {
  return await apiRequest({
    method: "get",
    url: `/user/todos?current_date=${date}`
  });
};

export const getClothesListByDate = async (
  date = moment().format("YYYY-MM-DD")
) => {
  return await apiRequest({
    method: "get",
    url: `/wearables?current_date=${date}`
  });
};

export const addUserCreatedTodos = async ({ names, date }) => {
  return await apiRequest({
    method: "post",
    url: `/user/todos/add`,
    data: { names: names, current_date: date }
  });
};
export const addWearables = async ({ name, date }) => {
  return await apiRequest({
    method: "post",
    url: "/wearables",
    data: {
      name: name,
      current_date: date
    }
  });
};
export const uploadWearableImage = async (clothId, file, onUploadProgress) => {
  console.log("file", file);
  const data = new FormData();
  data.append(`filesName`, {
    uri: file.uri,
    type: file.mimeType,
    name: file.filename || "cloth-image.jpeg"
  });

  return await apiRequest({
    method: "post",
    url: `/wearable/${clothId}/images`,
    data: data,
    headers: {
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress: progressEvent => {
      let percentCompleted = Math.floor(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onUploadProgress(percentCompleted);
    }
  });
};

export const getAccessoriesCategory = async () => {
  return await apiRequest({
    method: "get",
    url: `/accessories/categories`
  });
};

export const getAccessories = async ({
  categoryId,
  offset,
  accessoryIds,
  brandId,
  model
}) => {
  return await apiRequest({
    method: "get",
    url: `/accessories`,
    queryParams: {
      categoryid: categoryId,
      accessory_ids: accessoryIds.join(","),
      brand_id: brandId,
      model,
      offset
    }
  });
};

export const fetchOfferCategories = async () => {
  return await apiRequest({
    method: "get",
    url: `/offer/categories`
  });
};

export const fetchCategoryOffers = async ({
  categoryId,
  lastDiscountOfferId,
  lastCashbackOfferId,
  lastOtherOfferId,
  cashback,
  discount,
  otherOfferTypes,
  merchants = [],
  sort
}) => {
  const queryParams = {
    discount_offer_id: lastDiscountOfferId || undefined,
    cashback_offer_id: lastCashbackOfferId || undefined,
    other_offer_id: lastOtherOfferId || undefined,
    cashback: cashback || undefined,
    discount: discount || undefined,
    other: otherOfferTypes || undefined,
    merchant: merchants.length > 0 ? merchants.join() : undefined,
    cashback_sort: cashback ? sort : undefined,
    discount_sort: discount ? sort : undefined
  };
  return await apiRequest({
    method: "get",
    url: `/offer/categories/${categoryId}`,
    queryParams: JSON.parse(JSON.stringify(queryParams))
  });
};

export const createTransaction = async ({
  transactionId,
  statusType,
  price,
  quantity,
  onlineSellerId,
  sellerDetail,
  deliveryAddress,
  deliveryDate,
  productId,
  accessoryProductId,
  paymentMode,
  detailsUrl
}) => {
  const data = {
    transaction_id: transactionId,
    status_type: statusType,
    price: price,
    quantity: quantity,
    online_seller_id: onlineSellerId,
    seller_detail: sellerDetail,
    delivery_address: deliveryAddress,
    delivery_date: deliveryDate,
    product_id: productId,
    accessory_product_id: accessoryProductId,
    payment_mode: paymentMode,
    details_url: detailsUrl
  };
  return await apiRequest({
    method: "post",
    url: `/order`,
    data: JSON.parse(JSON.stringify(data))
  });
};

export const fetchOrderHistory = async () => {
  return await apiRequest({
    method: "get",
    url: `/order/history`
  });
};

export const createFuelExpense = async ({
  productId,
  effectiveDate,
  odometerReading,
  documentNumber,
  value,
  fuelQuantity,
  fuelType
}) => {
  const data = {
    effective_date: effectiveDate,
    odometer_reading: odometerReading,
    document_number: documentNumber,
    value,
    fuel_quantity: fuelQuantity,
    fuel_type: fuelType
  };
  return await apiRequest({
    method: "post",
    url: `/products/${productId}/fuel`,
    data: JSON.parse(JSON.stringify(data))
  });
};

export const updateFuelExpense = async ({
  id,
  productId,
  effectiveDate,
  odometerReading,
  documentNumber,
  value,
  fuelQuantity,
  fuelType
}) => {
  const data = {
    effective_date: effectiveDate,
    odometer_reading: odometerReading,
    document_number: documentNumber,
    value,
    fuel_quantity: fuelQuantity,
    fuel_type: fuelType
  };
  return await apiRequest({
    method: "put",
    url: `/products/${productId}/fuel/${id}`,
    data: JSON.parse(JSON.stringify(data))
  });
};

export const deleteFuelExpense = async ({ id, productId }) => {
  return await apiRequest({
    method: "delete",
    url: `/products/${productId}/fuel/${id}`
  });
};

export const getEhomeProducts = async ({
  type = 1,
  categoryIds = [],
  offset = 0
}) => {
  return await apiRequest({
    method: "get",
    url: `/consumer/ehome/products/${type}`,
    queryParams: {
      offset,
      category_id: categoryIds.join(",")
    }
  });
};

export const getSkuReferenceData = async () => {
  return await apiRequest({
    method: "get",
    url: `/sku/reference/data`
  });
};

export const getSkuItems = async ({
  mainCategoryId,
  categoryIds = [],
  brandIds = [],
  subCategoryIds = [],
  measurementValues = [],
  measurementTypes = [],
  barCode,
  searchTerm
}) => {
  return await apiRequest({
    method: "get",
    url: `/sku/list`,
    queryParams: {
      main_category_id: mainCategoryId,
      category_id: categoryIds.join(","),
      sub_category_ids: subCategoryIds.join(","),
      brand_ids: brandIds.join(","),
      measurement_value: measurementValues.join(","),
      measurement_types: measurementTypes.join(","),
      bar_code: barCode,
      title: searchTerm
    }
  });
};

export const getBarcodeSkuItem = async ({ barcode }) => {
  return await apiRequest({
    method: "get",
    url: `/sku/${barcode}/item`
  });
};

export const getSkuWishList = async () => {
  return await apiRequest({
    method: "get",
    url: `/sku/wishlist`
  });
};

export const addSkuItemToWishList = async item => {
  return await apiRequest({
    method: "post",
    url: `/sku/wishlist`,
    data: { ...item }
  });
};

export const addSkuItemToPastList = async item => {
  return await apiRequest({
    method: "post",
    url: `/sku/past`,
    data: { ...item }
  });
};

export const clearWishList = async item => {
  return await apiRequest({
    method: "delete",
    url: `/sku/wishlist`
  });
};

export const getMySellers = async (filters = {}) => {
  const { isFmcg, hasPos } = filters;
  return await apiRequest({
    method: "get",
    url: `/mysellers`,
    queryParams: {
      is_fmcg: isFmcg,
      has_pos: hasPos
    }
  });
};

export const getSellers = async ({
  searchTerm,
  limit,
  latitude,
  longitude
}) => {
  return await apiRequest({
    method: "get",
    url: `/sellers`,
    queryParams: {
      search_value: searchTerm
    }
  });
};

export const inviteSeller = async ({ phoneNumber }) => {
  return await apiRequest({
    method: "post",
    url: `/sellers/invite`,
    data: {
      contact_no: phoneNumber
    }
  });
};

export const getSellerDetails = async sellerId => {
  return await apiRequest({
    method: "get",
    url: `/sellers/${sellerId}`
  });
};

export const getSellerTransactionDetails = async sellerId => {
  return await apiRequest({
    method: "get",
    url: `/sellers/${sellerId}/transactions`
  })
}

export const linkSeller = async sellerId => {
  return await apiRequest({
    method: "put",
    url: `/sellers/${sellerId}/link`
  });
};

export const getCashbackTransactions = async () => {
  return await apiRequest({
    method: "get",
    url: `/cashback/details`
  });
};

export const retrieveWalletDetails = async () => {
  return await apiRequest({
    method: "get",
    url: `/wallet/details`
  });
};

export const retrieveActiveOrders = async () => {
  return await apiRequest({
    method: "get",
    url: `/consumer/orders/active`
  });
};

export const retrieveActiveServices = async () => {
  return await apiRequest({
    method: "get",
    url: `/consumer/assisted/active`
  });
};

export const placeOrder = async ({
  sellerId,
  orderType,
  serviceTypeId,
  serviceName,
  addressId
}) => {
  return await apiRequest({
    method: "post",
    url: `/consumer/orders/place`,
    data: {
      seller_id: sellerId,
      order_type: orderType,
      service_type_id: serviceTypeId,
      service_name: serviceName,
      user_address_id: addressId
    }
  });
};

export const getOrderDetails = async ({ orderId }) => {
  return await apiRequest({
    method: "get",
    url: `/consumer/orders/${orderId}`
  });
};

export const approveOrder = async ({ orderId, sellerId, skuList = [] }) => {
  return await apiRequest({
    method: "put",
    url: `/consumer/orders/${orderId}/approve`,
    data: { seller_id: sellerId, order_details: skuList }
  });
};

export const rejectOrder = async ({ orderId, sellerId }) => {
  return await apiRequest({
    method: "put",
    url: `/consumer/orders/${orderId}/reject`,
    data: { seller_id: sellerId }
  });
};

export const cancelOrder = async ({ orderId, sellerId }) => {
  return await apiRequest({
    method: "put",
    url: `/consumer/orders/${orderId}/cancel`,
    data: { seller_id: sellerId }
  });
};

export const completeOrder = async ({ orderId, sellerId }) => {
  return await apiRequest({
    method: "put",
    url: `/consumer/orders/${orderId}/paid`,
    data: { seller_id: sellerId }
  });
};
export const getUserAddresses = async () => {
  return await apiRequest({
    method: "get",
    url: "/consumer/addresses"
  });
};

export const updateUserAddresses = async item => {
  return await apiRequest({
    method: "post",
    url: "/consumer/addresses",
    data: item
  });
};

export const deleteUserAddresses = async id => {
  return await apiRequest({
    method: "delete",
    url: `/consumer/addresses/${id}`
  });
};

export const getCompletedOrders = async () => {
  return await apiRequest({
    method: "get",
    url: `/consumer/orders`
  });
};

export const getSellerAssistedServices = async ({ sellerId }) => {
  return await apiRequest({
    method: "get",
    url: `/sellers/${sellerId}/services`
  });
};

export const getSellersBBCashWallet = async () => {
  return await apiRequest({
    method: "get",
    url: `/sellers/cashbacks`
  });
};

export const redeemSellerPoints = async ({ sellerId, pointsToRedeem }) => {
  return await apiRequest({
    method: "put",
    url: `/sellers/${sellerId}/loyalty/redeem`,
    data: { amount: pointsToRedeem }
  });
};

export const redeemToPaytm = async ({ }) => {
  return await apiRequest({
    method: "put",
    url: `/cashback/redeem`
  });
};

export const redeemCashbackToSeller = async ({ sellerId, cashbackIds }) => {
  return await apiRequest({
    method: "put",
    url: `/sellers/${sellerId}/redeem`,
    data: { cashback_ids: cashbackIds }
  });
};

export const approveAssistedServiceOrder = async ({ orderId, sellerId }) => {
  return await apiRequest({
    method: "put",
    url: `/consumer/orders/${orderId}/approve`,
    data: { seller_id: sellerId }
  });
};

export const startAssistedServiceOrder = async ({
  orderId,
  orderDetails,
  sellerId
}) => {
  return await apiRequest({
    method: "put",
    url: `/consumer/assisted/${orderId}/start`,
    data: {
      seller_id: sellerId,
      order_details: orderDetails
    }
  });
};

export const endAssistedServiceOrder = async ({
  orderId,
  orderDetails,
  sellerId
}) => {
  return await apiRequest({
    method: "put",
    url: `/consumer/assisted/${orderId}/end`,
    data: {
      seller_id: sellerId,
      order_details: orderDetails
    }
  });
};

export const getSellerOffers = async () => {
  return await apiRequest({
    method: "get",
    url: `/sellers/offers`
  });
};
