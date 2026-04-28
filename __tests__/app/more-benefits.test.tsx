import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import MoreScreen from "@/app/(tabs)/more";

const setThemeMode = jest.fn();

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useLocalSearchParams: () => ({ tab: "benefits" }),
}));

jest.mock("@/lib/contexts/ClubContext", () => ({
  useClub: () => ({
    club: { slug: "rangers", name: "Rangers" },
    theme: {
      colors: {
        primary: "#E31E24",
        surface: "#111111",
        surfaceHighlight: "#222222",
        background: "#000000",
        text: "#FFFFFF",
        textSecondary: "#BBBBBB",
        textTertiary: "#999999",
        cardBorder: "#333333",
        gold: "#D4AF37",
      },
    },
    themeMode: "light",
    setThemeMode,
  }),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: ({ queryKey }: { queryKey: string[] }) => {
    if (queryKey[0] === "club-benefits") {
      return {
        data: [
          {
            id: "benefit-1",
            title: "20% en Restaurant Don Pepe",
            description: "Desc",
            category: "COMIDA",
            discount: "20%",
            partner: "Don Pepe",
            location: "Talca",
            membersOnly: true,
            requiredTier: "gold",
            expirationDate: null,
            image: "food",
          },
          {
            id: "benefit-2",
            title: "10% en Farmacia Cruz Verde",
            description: "Desc",
            category: "SALUD",
            discount: "10%",
            partner: "Cruz Verde",
            location: null,
            membersOnly: false,
            requiredTier: "fan",
            expirationDate: null,
            image: "health",
          },
        ],
        isLoading: false,
        error: null,
      };
    }

    return {
      data: [],
      isLoading: false,
      error: null,
    };
  },
}));

describe("More benefits tab", () => {
  it("filters benefits by category chip", () => {
    render(<MoreScreen />);

    expect(screen.getByText("20% en Restaurant Don Pepe")).toBeTruthy();
    expect(screen.getByText("10% en Farmacia Cruz Verde")).toBeTruthy();

    fireEvent.press(screen.getByText("SALUD"));

    expect(screen.queryByText("20% en Restaurant Don Pepe")).toBeNull();
    expect(screen.getByText("10% en Farmacia Cruz Verde")).toBeTruthy();
  });
});
