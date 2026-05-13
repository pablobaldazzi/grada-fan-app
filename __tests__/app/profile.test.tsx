import React from "react";
import { Alert } from "react-native";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import ProfileScreen from "@/app/profile";
import { deleteAccount } from "@/lib/api";

const logout = jest.fn();

jest.mock("@/lib/contexts/ClubContext", () => ({
  useClub: () => ({
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
      },
    },
  }),
}));

jest.mock("@/lib/hooks/useClerkAuth", () => ({
  useClerkAuth: () => ({
    fan: {
      id: "fan-1",
      email: "fan@example.com",
      firstName: "Test",
      lastName: "Fan",
      phone: "+56912345678",
    },
    user: null,
    profileStatus: { nationalId: "12.345.678-5" },
    refreshProfile: jest.fn(),
    logout,
  }),
}));

jest.mock("@/lib/api", () => ({
  updateProfile: jest.fn(),
  deleteAccount: jest.fn(),
}));

describe("ProfileScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (deleteAccount as jest.Mock).mockResolvedValue({
      status: "deleted",
      message: "Account deleted.",
      retainedRecords: [],
    });
  });

  it("shows account deletion and signs out after confirming", async () => {
    render(<ProfileScreen />);

    expect(screen.getByText("Eliminar cuenta")).toBeTruthy();
    expect(
      screen.getByText(
        "Elimina tu acceso y perfil. Las compras y entradas pueden quedar registradas cuando sea necesario.",
      ),
    ).toBeTruthy();

    fireEvent.press(screen.getByText("Eliminar cuenta"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Eliminar cuenta",
      expect.stringContaining("Se eliminará tu cuenta de acceso"),
      expect.any(Array),
    );

    const confirmButton = (Alert.alert as jest.Mock).mock.calls[0][2][1];
    await act(async () => {
      await confirmButton.onPress();
    });

    expect(deleteAccount).toHaveBeenCalledTimes(1);
    expect(logout).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith("/");
  });
});
