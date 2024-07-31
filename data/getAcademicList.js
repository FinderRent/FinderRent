import { academicListArabic } from "./academicArabic";
import { academicListEnglish } from "./academicEnglish";
import { academicListHebrew } from "./academicHebrew";
import { academicListRussian } from "./academicRussian";

export function getAcademicList(language) {
  let listAcademicIsrael = [];

  switch (language) {
    case "en":
      listAcademicIsrael = academicListEnglish.map((item) => ({
        label: item.name,
        value: item.id,
        coordinates: item.coordinates,
      }));
      break;
    case "he":
      listAcademicIsrael = academicListHebrew.map((item) => ({
        label: item.name,
        value: item.id,
        coordinates: item.coordinates,
      }));
      break;
    case "ru":
      listAcademicIsrael = academicListRussian.map((item) => ({
        label: item.name,
        value: item.id,
        coordinates: item.coordinates,
      }));
      break;
    case "ar":
      listAcademicIsrael = academicListArabic.map((item) => ({
        label: item.name,
        value: item.id,
        coordinates: item.coordinates,
      }));
      break;
  }

  return listAcademicIsrael;
}
