import { fetchClubExperience, fetchClubExperiences, reserveExperience } from "../../lib/api";
import { http } from "../../lib/http";

jest.mock("../../lib/demo-mode", () => ({
  getUseMockData: () => false,
}));

jest.mock("../../lib/http", () => ({
  http: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe("experiences api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads experiences from the public club endpoint", async () => {
    (http.get as jest.Mock).mockResolvedValue({
      data: [
        {
          id: "exp-1",
          title: "Meet & Greet",
          description: "Test description",
          date: "2026-03-20T12:00:00.000Z",
          time: "11:00",
          timeLabel: "11:00",
          location: "Talca",
          spotsTotal: 30,
          spotsRemaining: 8,
          price: "15000",
          currency: "CLP",
          membersOnly: true,
          image: "meetgreet",
        },
      ],
    });

    const result = await fetchClubExperiences("rangers");

    expect(http.get).toHaveBeenCalledWith("/public/clubs/rangers/experiences");
    expect(result[0]).toEqual(
      expect.objectContaining({
        id: "exp-1",
        price: 15000,
        spotsRemaining: 8,
      }),
    );
  });

  it("loads a single experience detail", async () => {
    (http.get as jest.Mock).mockResolvedValue({
      data: {
        id: "exp-1",
        title: "Meet & Greet",
        description: "Test description",
        date: "2026-03-20T12:00:00.000Z",
        time: "11:00",
        timeLabel: "11:00",
        location: "Talca",
        spotsTotal: 30,
        spotsRemaining: 8,
        price: 15000,
        currency: "CLP",
        membersOnly: true,
        image: "meetgreet",
      },
    });

    const result = await fetchClubExperience("rangers", "exp-1");

    expect(http.get).toHaveBeenCalledWith("/public/clubs/rangers/experiences/exp-1");
    expect(result.title).toBe("Meet & Greet");
  });

  it("posts a reservation with the membership tier", async () => {
    (http.post as jest.Mock).mockResolvedValue({
      data: {
        reservationId: "res-1",
        status: "CONFIRMED",
        experienceId: "exp-1",
        spotsRemaining: 7,
      },
    });

    const result = await reserveExperience("rangers", "exp-1", {
      membershipTier: "silver",
      name: "Test Fan",
    });

    expect(http.post).toHaveBeenCalledWith(
      "/public/clubs/rangers/experiences/exp-1/reservations",
      {
        membershipTier: "silver",
        name: "Test Fan",
      },
    );
    expect(result.spotsRemaining).toBe(7);
  });
});
