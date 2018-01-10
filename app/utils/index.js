const getProductMetasString = metasArray => {
  console.log(" metasArray: ", metasArray);
  if (!metasArray) {
    return "";
  }
  const metasWithValue = metasArray.filter(metaItem => {
    if (metaItem.value) return String(metaItem.value).length > 0;
    else return false;
  });

  return metasWithValue.map(metaItem => metaItem.value).join("/");
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
  return imageFileTypes.indexOf(fileType.toLowerCase()) > -1;
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
  if (Object.keys(extensionMimeTypeMap).indexOf(ext)) {
    return extensionMimeTypeMap[ext];
  }
  return "";
};

export { getProductMetasString, isImageFileType, getMimeTypeByExtension };
