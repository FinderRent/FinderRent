export const capitalizeWords = (string) => {
  if (!string) return "";

  // Trim leading and trailing spaces
  string = string.trim();

  return string
    .split(/\s+/) // Split by any whitespace
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const addSpaceBeforeUppercase = (str) => {
  return str.replace(/([A-Z])/g, " $1").trim();
};

export const fullName = (firstName, lastName) => {
  return `${firstName?.trim()} ${lastName?.trim()}`;
};

export const checkRtllanguages = (lang) => {
  const rtlLanguages = ["ar", "he", "fa", "ur"];
  return rtlLanguages.includes(lang);
};

export const ensureHttps = (url) => {
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  return url;
};

export const generateTemplateMessage = (language, address) => {
  let templateMessage = "";

  switch (language) {
    case "en":
      templateMessage = `Hello,
    
      I am interested in the apartment listed at:
    
      Address:
      - City: ${address.city}
      - Street: ${address.street}
      - Apartment Number: ${address.apartmentNumber}
      - Building Number: ${address.buildingNumber}
    
       Thank you,`;
      break;
    case "he":
      templateMessage = `שלום,

אני מעוניין בדירה הרשומה בכתובת:

כתובת:
- עיר: ${address.city}
- רחוב: ${address.street}
- מספר דירה: ${address.apartmentNumber}
- מספר בניין: ${address.buildingNumber}

תודה,`;
      break;
    case "ru":
      templateMessage = `Здравствуйте,

      Я заинтересован в квартире, указанной по адресу:
      
      Адрес:
      - Город: ${address.city}
      - Улица: ${address.street}
      - Номер квартиры: ${address.apartmentNumber}
      - Номер здания: ${address.buildingNumber}
      
      Спасибо,`;
      break;
    case "ar":
      templateMessage = `مرحبًا،

أنا مهتم بالشقة المدرجة على النحو التالي:

العنوان:
- المدينة: ${address.city}
- الشارع: ${address.street}
- رقم الشقة: ${address.apartmentNumber}
- رقم المبنى: ${address.buildingNumber}

شكرًا،`;
      break;
    default:
      templateMessage = "Language not supported.";
  }

  return templateMessage;
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
    "Land House": "home",
    "Housing Unit": "home-city",
    Tower: "city",
    Penthouse: "city-variant",
  };

  return iconMap[icon] || null;
};

export const convertCurrency = (fromCurrency, toCurrency, price) => {
  const exchangeRates = {
    USD: {
      ILS: 3.8,
      EUR: 0.88,
    },
    ILS: {
      USD: 1 / 3.8,
      EUR: 0.88 / 3.8,
    },
    EUR: {
      USD: 1 / 0.88,
      ILS: 3.8 / 0.88,
    },
  };

  const conversionRate = exchangeRates[fromCurrency]?.[toCurrency] || 1;

  return (price * conversionRate).toFixed(0);
};
