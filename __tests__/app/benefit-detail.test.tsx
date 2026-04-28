import React from "react";
import { render, screen } from "@testing-library/react-native";
import BenefitDetailScreen from "@/app/benefit-detail";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useLocalSearchParams: () => ({ benefitId: "benefit-1" }),
}));

jest.mock("@/lib/contexts/ClubContext", () => ({
  useClub: () => ({
    club: { slug: "rangers", name: "Rangers" },
  }),
}));

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    getQueryData: () => [],
  }),
  useQuery: () => ({
    data: {
      id: "benefit-1",
      title: "10% en Farmacia Cruz Verde",
      description: "Descuento en productos seleccionados de farmacia.",
      category: "SALUD",
      discount: "10%",
      partner: "Cruz Verde",
      location: null,
      membersOnly: false,
      requiredTier: "fan",
      expirationDate: null,
      image: "health",
    },
    isLoading: false,
    error: null,
  }),
}));

describe("Benefit detail screen", () => {
  it("renders API-backed benefit data and hides the location row when absent", () => {
    render(<BenefitDetailScreen />);

    expect(screen.getByText("10% en Farmacia Cruz Verde")).toBeTruthy();
    expect(screen.getByText("Cruz Verde")).toBeTruthy();
    expect(screen.queryByText("Ubicacion")).toBeNull();
  });
});
