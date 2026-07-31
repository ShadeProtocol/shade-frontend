import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Avatar, AvatarFallback, AvatarImage, getInitials } from "./avatar";

describe("getInitials", () => {
  it("takes the first letter of the first two words", () => {
    expect(getInitials("Shade Protocol")).toBe("SP");
  });

  it("uppercases a single-word name", () => {
    expect(getInitials("shade")).toBe("S");
  });

  it("ignores extra words and surrounding whitespace", () => {
    expect(getInitials("  acme widgets and co  ")).toBe("AW");
  });

  it("returns an empty string for a missing or blank name", () => {
    expect(getInitials(undefined)).toBe("");
    expect(getInitials("")).toBe("");
    expect(getInitials("   ")).toBe("");
  });
});

describe("Avatar", () => {
  it("falls back to initials derived from the business name when no logo is stored", () => {
    render(
      <Avatar>
        <AvatarImage src="" alt="Shade Protocol" />
        <AvatarFallback>{getInitials("Shade Protocol")}</AvatarFallback>
      </Avatar>,
    );

    expect(screen.getByText("SP")).toBeInTheDocument();
  });
});
