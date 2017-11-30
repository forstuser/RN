const getProductMetasString = metasArray => {
  const metasWithValue = metasArray.filter(
    metaItem => String(metaItem.value).length > 0
  );

  return metasWithValue.map(metaItem => metaItem.value).join("/");
};

const isImageFileType = fileType => {
  const imageFileTypes = ["jpg", "jpeg", "png", "bmp"];
  return imageFileTypes.indexOf(fileType.toLowerCase()) > -1;
};

export { getProductMetasString, isImageFileType };
