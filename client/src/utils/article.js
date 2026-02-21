export const getArticlePath = (article) => {
  const pathValue = article?.slug || article?._id || "";
  return `/article/${pathValue}`;
};

