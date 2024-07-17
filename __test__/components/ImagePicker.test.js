import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import * as ImagePickerFromGallery from "expo-image-picker";

import { useDarkMode } from "../../context/DarkModeContext";
import ImagePicker from "../../components/ImagePicker";

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: "Images",
  },
}));

jest.mock("../../context/DarkModeContext", () => ({
  useDarkMode: jest.fn(),
}));

describe("ImagePicker", () => {
  const onPickImageMock = jest.fn();
  const handleImageUploadMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call onPickImage with correct uri when image is picked", async () => {
    useDarkMode.mockReturnValue({ isDarkMode: false });
    ImagePickerFromGallery.launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: "test-uri" }],
    });

    const { getByText } = render(
      <ImagePicker
        onPickImage={onPickImageMock}
        handleImageUpload={handleImageUploadMock}
      />
    );

    fireEvent.press(getByText("Choose From Gallery"));

    await waitFor(() => {
      expect(onPickImageMock).toHaveBeenCalledWith("test-uri");
    });
  });

  it("should not call onPickImage when image picker is canceled", async () => {
    useDarkMode.mockReturnValue({ isDarkMode: false });
    ImagePickerFromGallery.launchImageLibraryAsync.mockResolvedValue({
      canceled: true,
    });

    const { getByText } = render(
      <ImagePicker
        onPickImage={onPickImageMock}
        handleImageUpload={handleImageUploadMock}
      />
    );

    fireEvent.press(getByText("Choose From Gallery"));

    await waitFor(() => {
      expect(onPickImageMock).not.toHaveBeenCalled();
    });
  });
});
