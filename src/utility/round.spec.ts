import { describe, expect, test } from "vitest";
import { round, roundNumber } from "~/utility/round.ts";

describe("round", () => {
  describe("round", () => {
    test("rounds to decimal point", () => {
      const result = round("1.2345", 2);
      expect(result).toBe("1.23");
    });

    test("cuts off trailing zeros", () => {
      const result = round("1.101", 2);
      expect(result).toBe("1.1");
    });
  });

  describe("roundNumber", () => {
    test("rounds to decimal point", () => {
      const result = roundNumber(1.2345, 2);
      expect(result).toBe(1.23);
    });
  });
});
