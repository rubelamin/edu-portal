export const textExcerpt = (description, numWords, tailIndicator = "....") => {
  const wordList = description.trim().split(" ");
  const truncateWords = wordList.slice(0, numWords).join(" ");
  const excerpt = truncateWords + tailIndicator;
  const finalExcerpt = excerpt?.length > numWords ? excerpt : description;

  return finalExcerpt;
};
