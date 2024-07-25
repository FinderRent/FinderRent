export const capitalizeWords = (string) => {
  if (!string) return "";

  // Trim leading and trailing spaces
  string = string.trim();

  return string
    .split(/\s+/) // Split by any whitespace
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const checkRtllanguages = (lang) => {
  const rtlLanguages = ["ar", "he", "fa", "ur"];
  return rtlLanguages.includes(lang);
};
