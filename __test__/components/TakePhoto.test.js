import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { launchCameraAsync } from "expo-image-picker";

import TakePhoto from "../../components/TakePhoto";
import { useDarkMode } from "../../context/DarkModeContext";

jest.mock("expo-image-picker", () => ({
  launchCameraAsync: jest.fn(),
}));

jest.mock("../../context/DarkModeContext", () => ({
  useDarkMode: jest.fn(),
}));

describe("TakePhoto", () => {
  const onTakeImageMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call onTakeImage with correct uri when image is taken", async () => {
    useDarkMode.mockReturnValue({ isDarkMode: false });
    launchCameraAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: "test-uri" }],
    });

    const { getByText } = render(<TakePhoto onTakeImage={onTakeImageMock} />);

    fireEvent.press(getByText("Take Picture"));

    await waitFor(() => {
      expect(onTakeImageMock).toHaveBeenCalledWith("test-uri");
    });
  });

  it("should not call onTakeImage when camera is canceled", async () => {
    useDarkMode.mockReturnValue({ isDarkMode: false });
    launchCameraAsync.mockResolvedValue({
      canceled: true,
    });

    const { getByText } = render(<TakePhoto onTakeImage={onTakeImageMock} />);

    fireEvent.press(getByText("Take Picture"));

    await waitFor(() => {
      expect(onTakeImageMock).not.toHaveBeenCalled();
    });
  });
});
