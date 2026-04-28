import { getFormationRows } from "../../lib/squad";

describe("getFormationRows", () => {
  it("returns configured rows for supported formations", () => {
    const rows = getFormationRows("4-3-3", 11);

    expect(rows).toHaveLength(4);
    expect(rows[1].players).toEqual([1, 2, 3, 4]);
    expect(rows[3].players).toEqual([8, 9, 10]);
  });

  it("falls back safely for unsupported formations", () => {
    const rows = getFormationRows("3-5-2", 11);

    expect(rows[0].players).toEqual([0]);
    expect(rows.flatMap((row) => row.players)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
  });

  it("falls back safely when the starter count is incomplete", () => {
    const rows = getFormationRows("4-4-2", 5);

    expect(rows.flatMap((row) => row.players)).toEqual([0, 1, 2, 3, 4]);
  });
});
