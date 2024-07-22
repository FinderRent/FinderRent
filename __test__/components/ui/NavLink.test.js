import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import NavLink from "../../../components/ui/NavLink";

// Mock the navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: mockGoBack,
    }),
  };
});

describe("NavLink", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockGoBack.mockClear();
  });

  it("renders correctly with given text", () => {
    const { getByText } = render(
      <NavigationContainer>
        <NavLink text="Test Link" routeName="TestRoute" />
      </NavigationContainer>
    );
    expect(getByText("Test Link")).toBeTruthy();
  });

  it("navigates to the specified route when pressed", () => {
    const { getByText } = render(
      <NavigationContainer>
        <NavLink text="Test Link" routeName="TestRoute" props={{ id: 1 }} />
      </NavigationContainer>
    );
    fireEvent.press(getByText("Test Link"));
    expect(mockNavigate).toHaveBeenCalledWith("TestRoute", { id: 1 });
  });

  it("calls navigation.goBack when no routeName is provided", () => {
    const { getByText } = render(
      <NavigationContainer>
        <NavLink text="Go Back" />
      </NavigationContainer>
    );
    fireEvent.press(getByText("Go Back"));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it("applies custom styles", () => {
    const customStyle = { color: "red" };
    const { getByText } = render(
      <NavigationContainer>
        <NavLink text="Styled Link" style={customStyle} />
      </NavigationContainer>
    );
    const linkText = getByText("Styled Link");
    const styleArray = linkText.props.style;
    expect(styleArray).toEqual(
      expect.arrayContaining([expect.objectContaining(customStyle)])
    );
  });
});
