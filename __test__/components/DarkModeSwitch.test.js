import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DarkModeSwitch from "../../components/ui/DarkModeSwitch";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("DarkModeSwitch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render with default value and fetch dark mode from AsyncStorage", async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(true));

    const { getByTestId } = render(
      <DarkModeSwitch color="black" onToggle={jest.fn()} />
    );
    const switchComponent = getByTestId("dark-mode-switch");

    await waitFor(() => {
      expect(switchComponent.props.value).toBe(true);
    });
  });

  it("should toggle switch and call onToggle with correct value", async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(false));
    const onToggleMock = jest.fn();

    const { getByTestId } = render(
      <DarkModeSwitch color="black" onToggle={onToggleMock} />
    );
    const switchComponent = getByTestId("dark-mode-switch");

    await waitFor(() => {
      expect(switchComponent.props.value).toBe(false);
    });

    fireEvent(switchComponent, "onValueChange");
    await waitFor(() => {
      expect(onToggleMock).toHaveBeenCalledWith(true);
    });
  });

  it("should handle errors when fetching dark mode from AsyncStorage", async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error("AsyncStorage error"));

    const { getByTestId } = render(
      <DarkModeSwitch color="black" onToggle={jest.fn()} />
    );
    const switchComponent = getByTestId("dark-mode-switch");

    await waitFor(() => {
      expect(switchComponent.props.value).toBe(false);
    });
  });
});
