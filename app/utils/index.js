const getProductMetasString = metasArray => {
  const metasWithValue = metasArray.filter(
    metaItem => String(metaItem.value).length > 0
  );

  return metasWithValue.map(metaItem => metaItem.value).join("/");
};

export { getProductMetasString };
