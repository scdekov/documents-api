import { getMiddleIndex } from "../../../../src/api/services/getMiddleIndex";

describe("get middle index", () => {
  test("empty strings", () => {
    const [start, end] = ["", ""];
    expect(getMiddleIndex(start, end) > start);
    expect(getMiddleIndex(start, end) > end);
  });

  test("one empty string", () => {
    const [start, end] = ["", "n"];
    expect(getMiddleIndex(start, end) > start);
    expect(getMiddleIndex(start, end) < end);
  });

  test("more items", () => {
    const first = getMiddleIndex("", "");
    const second = getMiddleIndex(first, "");
    const betweenFirstAndSecond = getMiddleIndex(first, second);
    const betweenFirstAndSecondAndSecond = getMiddleIndex(
      first,
      betweenFirstAndSecond
    );
    expect(betweenFirstAndSecond > first).toBeTruthy();
    expect(betweenFirstAndSecond < second).toBeTruthy();
    expect(betweenFirstAndSecondAndSecond > first).toBeTruthy();
    expect(betweenFirstAndSecondAndSecond < betweenFirstAndSecond).toBeTruthy();
    expect(betweenFirstAndSecondAndSecond < second).toBeTruthy();
  });

  test("many items", () => {
    const items: string[] = [];
    while (items.length < 1000) {
      items.push(getMiddleIndex(items[items.length - 1] || "", ""));
    }

    expect(
      items
        .map((item, ix) =>
          ix < items.length - 1 ? item < items[ix + 1] : true
        )
        .every(Boolean)
    ).toBeTruthy();
  });
});
