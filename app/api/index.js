import { Navigation } from "react-native-navigation";
import axios from "axios";
import store from "../store";
import DeviceInfo from "react-native-device-info";
import navigation from "../navigation";
import { actions as uiActions } from "../modules/ui";

export const API_BASE_URL = "https://consumer-eb.binbill.com";

let HAS_OPENED_FORCE_UPDATE_SCREEN = false;

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
  console.log(
    "New Request: ",
    method,
    url,
    "data: ",
    data,
    "queryParams: ",
    queryParams
  );
  try {
    const token = store.getState().loggedInUser.authToken;
    if (token) {
      headers.Authorization = token;
      console.log("auth token: ", token);
    }

    headers.ios_app_version = DeviceInfo.getBuildNumber();

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
    console.log("r.data: ", r.data);
    if (r.data.status == false) {
      let error = new Error(r.data.message);
      error.statusCode = 400;
      throw error;
    }
    if (r.data.forceUpdate === true && !HAS_OPENED_FORCE_UPDATE_SCREEN) {
      HAS_OPENED_FORCE_UPDATE_SCREEN = true;
      navigation.openForceUpdateScreen();
    } else if (
      r.data.forceUpdate === false &&
      !store.getState().ui.hasUpdateAppScreenShown
    ) {
      store.dispatch(uiActions.setUiHasUpdateAppScreenShown(true));
      navigation.openForceUpdateModal();
    }

    return r.data;
  } catch (e) {
    console.log("e: ", e);
    let error = new Error(e.message);
    error.statusCode = e.statusCode || 0;
    if (e.response) {
      console.log("e.response.data: ", e.response.data);
      error.statusCode = e.response.status;
    }
    throw error;
  }
};

export const uploadDocuments = async ({
  jobId = null,
  type = null,
  itemId,
  files,
  onUploadProgress
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

export const consumerValidate = async (phoneNo, token, fcmToken) => {
  let data = {
    Token: token,
    TrueObject: { PhoneNo: phoneNo },
    BBLogin_Type: 1,
    platform: 2
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
      fcmId: fcmToken,
      platform: 2
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
    job_id: jobId,
    provider_id: providerId,
    provider_name: providerName,
    renewal_type: renewalType,
    effective_date: effectiveDate,
    warranty_type: warrantyType,
    main_category_id: mainCategoryId,
    category_id: categoryId
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
    job_id: jobId,
    provider_id: providerId,
    provider_name: providerName,
    renewal_type: renewalType,
    effective_date: effectiveDate,
    warranty_type: warrantyType,
    main_category_id: mainCategoryId,
    category_id: categoryId
  };

  return await apiRequest({
    method: "post",
    url: `/products/${productId}/warranties`,
    data: JSON.parse(JSON.stringify(data)) //to remove undefined keys
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
    job_id: jobId,
    provider_id: providerId,
    provider_name: providerName,
    effective_date: effectiveDate,
    policy_no: policyNo,
    value: value,
    amount_insured: amountInsured,
    main_category_id: mainCategoryId,
    category_id: categoryId
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
    job_id: jobId,
    provider_id: providerId,
    provider_name: providerName,
    effective_date: effectiveDate,
    policy_no: policyNo,
    value: value,
    amount_insured: amountInsured,
    main_category_id: mainCategoryId,
    category_id: categoryId
  };

  return await apiRequest({
    method: "post",
    url: `/products/${productId}/insurances`,
    data: JSON.parse(JSON.stringify(data)) //to remove undefined keys
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
    job_id: jobId,
    effective_date: effectiveDate,
    value: value,
    seller_name: sellerName,
    seller_contact: sellerContact
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
    effective_date: effectiveDate,
    value: value || undefined,
    seller_name: sellerName || undefined,
    seller_contact: sellerContact || undefined,
    expiry_period: expiryPeriod || undefined
  };

  return await apiRequest({
    method: "post",
    url: `/products/${productId}/amcs`,
    data: JSON.parse(JSON.stringify(data)) //to remove undefined keys
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
    effective_date: effectiveDate,
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
    job_id: jobId,
    effective_date: effectiveDate,
    value: value,
    seller_name: sellerName,
    seller_contact: sellerContact,
    expiry_period: expiryPeriod
  };

  return await apiRequest({
    method: "post",
    url: `/products/${productId}/pucs`,
    data: JSON.parse(JSON.stringify(data)) //to remove undefined keys
  });
};
