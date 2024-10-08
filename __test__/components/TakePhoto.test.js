import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import {
  launchCameraAsync,
  requestCameraPermissionsAsync,
} from "expo-image-picker";

import TakePhoto from "../../components/TakePhoto";
import { useDarkMode } from "../../context/DarkModeContext";

jest.mock("expo-image-picker", () => ({
  launchCameraAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
}));

jest.mock("../../context/DarkModeContext", () => ({
  useDarkMode: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("TakePhoto", () => {
  const onTakeImageMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn(); // Mock alert
  });

  it("should call onTakeImage with correct uri when image is taken", async () => {
    useDarkMode.mockReturnValue({ isDarkMode: false });
    requestCameraPermissionsAsync.mockResolvedValue({ status: "granted" });
    launchCameraAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: "test-uri" }],
    });

    const { getByText } = render(<TakePhoto onTakeImage={onTakeImageMock} />);

    fireEvent.press(getByText("takePicture"));

    await waitFor(() => {
      expect(onTakeImageMock).toHaveBeenCalledWith("test-uri");
    });
  });

  it("should not call onTakeImage when camera is canceled", async () => {
    useDarkMode.mockReturnValue({ isDarkMode: false });
    requestCameraPermissionsAsync.mockResolvedValue({ status: "granted" });
    launchCameraAsync.mockResolvedValue({
      canceled: true,
    });

    const { getByText } = render(<TakePhoto onTakeImage={onTakeImageMock} />);

    fireEvent.press(getByText("takePicture"));

    await waitFor(() => {
      expect(onTakeImageMock).not.toHaveBeenCalled();
    });
  });

  it("should not call onTakeImage when camera permissions are not granted", async () => {
    useDarkMode.mockReturnValue({ isDarkMode: false });
    requestCameraPermissionsAsync.mockResolvedValue({ status: "denied" });

    const { getByText } = render(<TakePhoto onTakeImage={onTakeImageMock} />);

    fireEvent.press(getByText("takePicture"));

    await waitFor(() => {
      expect(onTakeImageMock).not.toHaveBeenCalled();
    });
  });
});
