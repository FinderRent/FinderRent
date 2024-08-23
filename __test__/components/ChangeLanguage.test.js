import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18next from "../../services/i18next";

import { DarkModeProvider } from "../../context/DarkModeContext";
import ChangeLanguageModal from "../../modals/ChangeLanguageModal";

jest.mock("i18next", () => ({
  use: jest.fn().mockReturnThis(),
  init: jest.fn(),
  changeLanguage: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock("expo-updates", () => ({
  reloadAsync: jest.fn(),
}));

const renderWithProviders = (ui) => {
  return render(<DarkModeProvider>{ui}</DarkModeProvider>);
};

describe("ChangeLanguageModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize language from AsyncStorage", async () => {
    AsyncStorage.getItem.mockResolvedValue("he");
    const { getByText } = renderWithProviders(
      <ChangeLanguageModal showVisible={jest.fn()} />
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("appLanguage");
      expect(getByText("עברית")).toBeTruthy();
    });
  });

  it("should change language without showing restart modal if direction does not change", async () => {
    AsyncStorage.getItem.mockResolvedValue("he");
    const { getByText } = renderWithProviders(
      <ChangeLanguageModal showVisible={jest.fn()} />
    );

    fireEvent.press(getByText("English"));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("appLanguage", "en");
      expect(i18next.changeLanguage).toHaveBeenCalledWith("en");
    });
  });

  it("should show and handle restart modal", async () => {
    AsyncStorage.getItem.mockResolvedValue("en");
    const { getByText } = renderWithProviders(
      <ChangeLanguageModal showVisible={jest.fn()} />
    );

    fireEvent.press(getByText("עברית"));

    await waitFor(() => {
      expect(getByText("language_change_message")).toBeTruthy();
    });
  });
});
