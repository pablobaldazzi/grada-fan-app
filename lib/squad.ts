export type FormationRow = {
  y: number;
  players: number[];
};

const FORMATION_ROWS: Record<string, FormationRow[]> = {
  "4-4-2": [
    { y: 0.88, players: [0] },
    { y: 0.7, players: [1, 2, 3, 4] },
    { y: 0.46, players: [5, 6, 7, 8] },
    { y: 0.22, players: [9, 10] },
  ],
  "4-3-3": [
    { y: 0.88, players: [0] },
    { y: 0.7, players: [1, 2, 3, 4] },
    { y: 0.48, players: [5, 6, 7] },
    { y: 0.22, players: [8, 9, 10] },
  ],
  "4-2-3-1": [
    { y: 0.88, players: [0] },
    { y: 0.72, players: [1, 2, 3, 4] },
    { y: 0.56, players: [5, 6] },
    { y: 0.38, players: [7, 8, 9] },
    { y: 0.18, players: [10] },
  ],
};

export function getFormationRows(
  formation: string,
  playerCount: number,
): FormationRow[] {
  const configuredRows = FORMATION_ROWS[formation];
  if (
    configuredRows &&
    configuredRows.every((row) =>
      row.players.every((playerIndex) => playerIndex < playerCount),
    )
  ) {
    return configuredRows;
  }

  if (playerCount <= 0) {
    return [];
  }

  const rows: FormationRow[] = [{ y: 0.88, players: [0] }];
  const yValues = [0.68, 0.46, 0.24];
  let nextPlayerIndex = 1;

  for (const y of yValues) {
    if (nextPlayerIndex >= playerCount) {
      break;
    }

    const remaining = playerCount - nextPlayerIndex;
    const size = Math.min(4, remaining);

    rows.push({
      y,
      players: Array.from(
        { length: size },
        (_, index) => nextPlayerIndex + index,
      ),
    });

    nextPlayerIndex += size;
  }

  return rows;
}
