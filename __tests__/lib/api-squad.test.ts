jest.mock("expo-constants", () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {},
    },
  },
}));

jest.mock("../../lib/http", () => ({
  http: {
    get: jest.fn(),
  },
}));

import { fetchClubSquad } from "../../lib/api";
import { http } from "../../lib/http";

describe("fetchClubSquad", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("parses a squad payload from the public API", async () => {
    (http.get as jest.Mock).mockResolvedValue({
      data: {
        name: "4-3-3",
        coach: "Erwin Duran",
        startingEleven: [
          {
            id: "sp-1",
            name: "J.L. Gamonal",
            number: 1,
            position: "GK",
            role: "Portero",
          },
        ],
        substitutes: [],
      },
    });

    const result = await fetchClubSquad("rangers");

    expect(http.get).toHaveBeenCalledWith("/public/clubs/rangers/squad");
    expect(result?.coach).toBe("Erwin Duran");
  });

  it("returns null when the endpoint responds with null", async () => {
    (http.get as jest.Mock).mockResolvedValue({ data: null });

    await expect(fetchClubSquad("deportes-concepcion")).resolves.toBeNull();
  });
});
