import { capitalizeWords } from "../../utils/features";

describe("capitalizeWords function", () => {
  it("capitalizes each word in a string correctly", () => {
    expect(capitalizeWords("hello world")).toEqual("Hello World");
    expect(capitalizeWords("tHIS iS a TeSt")).toEqual("This Is A Test");
    expect(capitalizeWords("")).toEqual("");
  });

  it("handles edge cases", () => {
    expect(capitalizeWords(undefined)).toEqual("");
    expect(capitalizeWords(null)).toEqual("");
    expect(capitalizeWords("")).toEqual("");
    expect(capitalizeWords("  ")).toEqual("");
    expect(capitalizeWords("  only   one  space ")).toEqual("Only One Space");
  });
});
