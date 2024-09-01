import {
  addSpaceBeforeUppercase,
  capitalizeWords,
  checkRtllanguages,
  ensureHttps,
  fullName,
  iconName,
} from "../../utils/features";

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

describe("checkRtllanguages function", () => {
  it("returns true for RTL languages", () => {
    expect(checkRtllanguages("ar")).toEqual(true);
    expect(checkRtllanguages("he")).toEqual(true);
    expect(checkRtllanguages("fa")).toEqual(true);
    expect(checkRtllanguages("ur")).toEqual(true);
  });

  it("returns false for non-RTL languages", () => {
    expect(checkRtllanguages("en")).toEqual(false);
    expect(checkRtllanguages("fr")).toEqual(false);
    expect(checkRtllanguages("de")).toEqual(false);
    expect(checkRtllanguages("es")).toEqual(false);
  });

  it("handles edge cases", () => {
    expect(checkRtllanguages("")).toEqual(false);
    expect(checkRtllanguages(null)).toEqual(false);
    expect(checkRtllanguages(undefined)).toEqual(false);
    expect(checkRtllanguages("jp")).toEqual(false); // non-RTL language
  });
});

describe("fullName", () => {
  test("returns the full name with trimmed first and last names", () => {
    expect(fullName(" John ", " Doe ")).toBe("John Doe");
    expect(fullName("Jane", "Doe")).toBe("Jane Doe");
  });

  test("handles empty first name", () => {
    expect(fullName("", "Doe")).toBe(" Doe");
  });

  test("handles empty last name", () => {
    expect(fullName("John", "")).toBe("John ");
  });
});

describe("iconName function", () => {
  it("returns the correct icon name for known icons", () => {
    expect(iconName("tv")).toEqual("television");
    expect(iconName("television")).toEqual("television");
    expect(iconName("beds")).toEqual("bed");
    expect(iconName("bed")).toEqual("bed");
    expect(iconName("wifi")).toEqual("wifi");
    expect(iconName("wi-fi")).toEqual("wifi");
    expect(iconName("wireless internet")).toEqual("wifi");
    expect(iconName("balcony")).toEqual("balcony");
    expect(iconName("oven")).toEqual("toaster-oven");
    expect(iconName("microwave")).toEqual("microwave");
    expect(iconName("couch")).toEqual("sofa");
    expect(iconName("coffeeTable")).toEqual("table-furniture");
    expect(iconName("waterHeater")).toEqual("water-boiler");
    expect(iconName("washer")).toEqual("washing-machine");
    expect(iconName("dryer")).toEqual("tumble-dryer");
    expect(iconName("iron")).toEqual("iron");
    expect(iconName("refrigirator")).toEqual("fridge");
    expect(iconName("fridge")).toEqual("fridge");
    expect(iconName("freezer")).toEqual("fridge-bottom");
  });

  it("returns null for unknown icons", () => {
    expect(iconName("unknown")).toEqual(null);
    expect(iconName("lamp")).toEqual(null);
    expect(iconName("stove")).toEqual(null);
  });

  it("handles edge cases", () => {
    expect(iconName("")).toEqual(null);
    expect(iconName(null)).toEqual(null);
    expect(iconName(undefined)).toEqual(null);
  });
});

describe("ensureHttps", () => {
  it('should replace "http://" with "https://" if the URL starts with "http://"', () => {
    expect(ensureHttps("http://example.com")).toBe("https://example.com");
  });

  it('should return the same URL if it already starts with "https://"', () => {
    expect(ensureHttps("https://example.com")).toBe("https://example.com");
  });

  it('should return the same URL if it does not start with "http://" or "https://"', () => {
    expect(ensureHttps("ftp://example.com")).toBe("ftp://example.com");
  });
});

describe("addSpaceBeforeUppercase", () => {
  it("should add a space before each uppercase letter", () => {
    expect(addSpaceBeforeUppercase("HelloWorld")).toBe("Hello World");
  });

  it("should handle strings without uppercase letters correctly", () => {
    expect(addSpaceBeforeUppercase("helloworld")).toBe("helloworld");
  });

  it("should handle strings with multiple uppercase letters correctly", () => {
    expect(addSpaceBeforeUppercase("ThisIsATestString")).toBe(
      "This Is A Test String"
    );
  });

  it("should return an empty string if input is empty", () => {
    expect(addSpaceBeforeUppercase("")).toBe("");
  });

  it("should not add space before the first character if it is uppercase", () => {
    expect(addSpaceBeforeUppercase("UpperCase")).toBe("Upper Case");
  });
});
