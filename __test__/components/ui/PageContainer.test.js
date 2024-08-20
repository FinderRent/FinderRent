import React from "react";
import { render } from "@testing-library/react-native";
import { Text } from "react-native-paper";
import PageContainer from "../../../components/ui/PageContainer";

describe("PageContainer", () => {
  it("should render children correctly", () => {
    const { getByText } = render(
      <PageContainer>
        <Text>Test Child</Text>
      </PageContainer>
    );

    expect(getByText("Test Child")).toBeTruthy();
  });
});
