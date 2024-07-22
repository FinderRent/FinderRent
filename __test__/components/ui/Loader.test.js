import React from "react";
import { render } from "@testing-library/react-native";
import Loader from "../../../components/ui/Loader";

// Mock the ActivityIndicator
jest.mock("react-native-paper", () => ({
  ActivityIndicator: jest.fn().mockImplementation(({ color, size }) => null),
}));

import { ActivityIndicator } from "react-native-paper";

describe("Loader", () => {
  it("renders correctly with given color and size", () => {
    render(<Loader color="blue" size="large" />);

    expect(ActivityIndicator).toHaveBeenCalledWith(
      expect.objectContaining({
        color: "blue",
        size: "large",
        animating: true,
        testID: "loader-activity-indicator",
      }),
      {}
    );
  });
});
