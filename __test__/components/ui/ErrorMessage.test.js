import React from "react";
import { render } from "@testing-library/react-native";

// import { Color } from "../../constants/colors";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { Color } from "../../../constants/colors";

describe("ErrorMessage", () => {
  it("renders correctly with an error message", () => {
    const { getByText } = render(
      <ErrorMessage errorMessage="This is an error" />
    );
    expect(getByText("This is an error")).toBeTruthy();
  });

  it('removes "Error:" prefix from the message', () => {
    const { getByText } = render(
      <ErrorMessage errorMessage="Error: This is an error" />
    );
    expect(getByText("This is an error")).toBeTruthy();
  });

  it("renders nothing when no error message is provided", () => {
    const { queryByText } = render(<ErrorMessage />);
    expect(queryByText(/./)).toBeNull();
  });

  it("applies correct styles", () => {
    const { getByTestId } = render(
      <ErrorMessage errorMessage="Test error" testID="error-message" />
    );

    const container = getByTestId("error-message");
    expect(container.props.style).toEqual(
      expect.objectContaining({
        marginTop: 5,
        marginHorizontal: 5,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: "#f8d7da",
        borderColor: "#f5c6cb",
      })
    );

    const textElement = container.props.children;
    expect(textElement.props.style).toEqual(
      expect.objectContaining({
        color: Color.errorText,
        fontSize: 14,
      })
    );
  });
});
