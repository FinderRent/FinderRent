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

export const iconName = (icon) => {
  const iconMap = {
    tv: "television",
    television: "television",
    beds: "bed",
    bed: "bed",
    wifi: "wifi",
    "wi-fi": "wifi",
    "wireless internet": "wifi",
    balcony: "balcony",
    oven: "toaster-oven",
    microwave: "microwave",
    couch: "sofa",
    coffeeTable: "table-furniture",
    waterHeater: "water-boiler",
    washer: "washing-machine",
    dryer: "tumble-dryer",
    iron: "iron",
    refrigirator: "fridge",
    fridge: "fridge",
    freezer: "fridge-bottom",
  };

  return iconMap[icon] || null;
};
