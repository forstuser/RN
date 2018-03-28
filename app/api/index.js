import { Platform } from "react-native";
import { Navigation } from "react-native-navigation";
import axios from "axios";
import store from "../store";
import DeviceInfo from "react-native-device-info";
import navigation, { openLoginScreen } from "../navigation";
import { actions as uiActions } from "../modules/ui";
import { actions as loggedInUserActions } from "../modules/logged-in-user";
import Analytics from "../analytics";

export const API_BASE_URL = "https://consumer-stage.binbill.com";

let HAS_OPENED_FORCE_UPDATE_SCREEN = false;
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
    if (token) {
      headers.Authorization = token;
      console.log("auth token: ", token);
    }

    const language = store.getState().ui.language;
    if (language) {
      headers.language = language.code;
    }

    if (Platform.OS == "ios") {
      headers.ios_app_version = DeviceInfo.getBuildNumber();
    } else {
      headers.app_version = 17; //android app version
    }

    console.log(
      "New Request: ",
      method,
      url,
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

    if (r.data.forceUpdate === true) {
      if (!HAS_OPENED_FORCE_UPDATE_SCREEN) {
        HAS_OPENED_FORCE_UPDATE_SCREEN = true;
        navigation.openForceUpdateScreen();
      }
    } else if (
      r.data.forceUpdate === false &&
      !store.getState().ui.hasUpdateAppScreenShown
    ) {
      store.dispatch(uiActions.setUiHasUpdateAppScreenShown(true));
      navigation.openForceUpdateModal();
    }

    if (r.data.status == false) {
      Analytics.logEvent(
        Analytics.EVENTS.API_ERROR + `${url.replace(/\//g, "_")}`,
        { message: r.data.message }
      );
      let error = new Error(r.data.message);
      error.statusCode = 400;
      throw error;
    }

    return r.data;
  } catch (e) {
    console.log("e: ", e);
    let error = new Error(e.message);
    error.statusCode = e.statusCode || 0;

    let errorMessage = e.message;
    if (e.response) {
      console.log("e.response.data: ", e.response.data);
      error.statusCode = e.response.status;
      errorMessage = e.response.data.message;
    }
    Analytics.logEvent(
      Analytics.EVENTS.API_ERROR + `${url.replace(/\//g, "_")}`,
      { message: errorMessage }
    );

    if (error.statusCode == 401) {
      store.dispatch(loggedInUserActions.setLoggedInUserAuthToken(null));
      openLoginScreen();
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
  onUploadProgress = () => {}
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
        progressEvent.loaded * 100 / progressEvent.total
      );
      onUploadProgress(percentCompleted);
    }
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
        progressEvent.loaded * 100 / progressEvent.total
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
      fcmId: store.getState().loggedInUser.fcmToken,
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
    value: value,
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

export const initProduct = async (mainCategoryId, categoryId) => {
  return await apiRequest({
    method: "post",
    url: "/products/init",
    data: {
      main_category_id: mainCategoryId,
      category_id: categoryId
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

export const fetchDoYouKnowItems = async ({ tagIds }) => {
  return await apiRequest({
    method: "post",
    url: "/know/items",
    data: { tag_id: tagIds }
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
    wages_type: wagesType || undefined,
    selected_days: selectedDays || undefined,
    unit_price: unitPrice || 0,
    unit_type: unitType || undefined,
    quantity: quantity || undefined,
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
  providerName
}) => {
  return await apiRequest({
    method: "put",
    url: `/calendar/items/${itemId}`,
    data: {
      product_name: productName || undefined,
      provider_name: providerName || undefined
    }
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
    quantity: quantity || undefined,
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

export const verifyPin = async ({ pin }) => {
  return await apiRequest({
    method: "post",
    url: `/consumer/pin`,
    data: {
      pin
    }
  });
};

export const setPin = async ({ oldPin, pin }) => {
  return await apiRequest({
    method: "post",
    url: `/consumer/pin/reset`,
    data: {
      old_pin: oldPin,
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
