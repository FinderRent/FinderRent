import React from "react";
import { render } from "@testing-library/react-native";
import Separator from "../../../components/Seperator";

describe("Separator", () => {
  it("renders correctly with the expected styles", () => {
    const { getByTestId } = render(<Separator />);
    const separator = getByTestId("separator-view");

    expect(separator.props.style).toEqual({
      height: 2,
      width: "100%",
      backgroundColor: "#ddd",
      marginVertical: 10,
    });
  });
});
