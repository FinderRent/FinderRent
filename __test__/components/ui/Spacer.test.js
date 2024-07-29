import React from "react";
import { View } from "react-native";
import { render } from "@testing-library/react-native";
import Spacer from "../../../components/ui/Spacer";

describe("Spacer", () => {
  it("renders correctly with children", () => {
    const { getByTestId } = render(
      <Spacer>
        <View testID="child" />
      </Spacer>
    );

    const child = getByTestId("child");
    expect(child).toBeTruthy();
  });

  it("applies correct styles", () => {
    const { getByTestId } = render(
      <Spacer testID="spacer">
        <View />
      </Spacer>
    );

    const spacer = getByTestId("spacer");
    expect(spacer.props.style).toEqual(
      expect.objectContaining({
        marginTop: 5,
        marginBottom: 7,
      })
    );
  });
});
