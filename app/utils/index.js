import { MAIN_CATEGORY_IDS } from "../constants";

const getProductMetasString = metasArray => {
  if (!metasArray) {
    return "";
  }
  const metasWithValue = metasArray.filter(metaItem => {
    if (metaItem.value) return String(metaItem.value).length > 0;
    else return false;
  });

  return metasWithValue.map(metaItem => metaItem.value).join("/");
};

const getMetaValueByKey = (metasArray, keyName) => {
  if (!metasArray || !keyName) {
    return "";
  }
  const meta = metasArray.find(
    m => m.name.toLowerCase().indexOf(keyName.toLowerCase()) > -1
  );
  if (!meta) {
    return "";
  } else {
    return meta.value;
  }
};

const isImageFileType = fileType => {
  const imageFileTypes = [
    "jpg",
    "jpeg",
    "png",
    "bmp",
    "image/jpeg",
    "image/png"
  ];
  return imageFileTypes.indexOf((fileType || "").toLowerCase()) > -1;
};

const getMimeTypeByExtension = ext => {
  const extensionMimeTypeMap = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    bmp: "image/bmp",
    txt: "text/plain",
    pdf: "application/pdf",
    doc: "application/pdf",
    docx:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    rtf: "text/richtext",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  };
  if (Object.keys(extensionMimeTypeMap).indexOf(ext.toLowerCase()) > -1) {
    return extensionMimeTypeMap[ext];
  }
  return "";
};

/**
 * checks if mainCategoryId is of product type
 * @param {number} mainCategoryId
 */
const isOfProductType = mainCategoryId => {
  return (
    [
      MAIN_CATEGORY_IDS.AUTOMOBILE,
      MAIN_CATEGORY_IDS.ELECTRONICS,
      MAIN_CATEGORY_IDS.FURNITURE
    ].indexOf(mainCategoryId) > -1
  );
};

/**
 * checks if mainCategoryId is of expense type
 * @param {number} mainCategoryId
 */
const isOfExpenseType = mainCategoryId => {
  return (
    [
      MAIN_CATEGORY_IDS.FASHION,
      MAIN_CATEGORY_IDS.HEALTHCARE,
      MAIN_CATEGORY_IDS.HOUSEHOLD,
      MAIN_CATEGORY_IDS.TRAVEL,
      MAIN_CATEGORY_IDS.SERVICES,
      MAIN_CATEGORY_IDS.OTHERS
    ].indexOf(mainCategoryId) > -1
  );
};

/**
 * checks if mainCategoryId is of personal type
 * @param {number} mainCategoryId
 */
const isOfPersonalType = mainCategoryId => {
  return mainCategoryId == MAIN_CATEGORY_IDS.PERSONAL;
};

export {
  getProductMetasString,
  isImageFileType,
  getMimeTypeByExtension,
  isOfProductType,
  isOfExpenseType,
  isOfPersonalType,
  getMetaValueByKey
};
