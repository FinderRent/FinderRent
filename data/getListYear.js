import { useTranslation } from "react-i18next";

export function getYearList() {
  const { t } = useTranslation();

  return [
    { label: t("signUp.preparing"), value: t("signUp.preparing") },
    { label: t("signUp.year1"), value: t("signUp.year1") },
    { label: t("signUp.year2"), value: t("signUp.year2") },
    { label: t("signUp.year3"), value: t("signUp.year3") },
    { label: t("signUp.year4"), value: t("signUp.year4") },
    { label: t("signUp.masterDegree"), value: t("signUp.masterDegree") },
  ];
}
