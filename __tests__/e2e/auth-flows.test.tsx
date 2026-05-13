import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';

// Screen components
import LoginScreen from '@/app/(auth)/login';
import RegisterScreen from '@/app/(auth)/register';

jest.mock('@/lib/contexts/ClubContext', () => ({
  useClub: () => ({
    club: { id: 'club-1', name: 'Test Club', logoUrl: null, useFullLogo: false },
    theme: {
      colors: {
        background: '#000',
        text: '#fff',
        textSecondary: '#aaa',
        primary: '#f00',
        error: '#f66',
        info: '#6cf',
      },
    },
  }),
}));

const mockSignInCreate = jest.fn();
const mockSignUpCreate = jest.fn();
const mockSetActive = jest.fn();
const mockPrepareEmailAddressVerification = jest.fn();

jest.mock('@/lib/demo-mode', () => ({
  getUseMockData: () => false,
}));

jest.mock('@clerk/clerk-expo', () => ({
  useSignIn: () => ({
    signIn: { create: mockSignInCreate },
    setActive: mockSetActive,
    isLoaded: true,
  }),
  useSignUp: () => ({
    signUp: {
      create: mockSignUpCreate,
      prepareEmailAddressVerification: mockPrepareEmailAddressVerification,
    },
    setActive: mockSetActive,
    isLoaded: true,
  }),
}));

describe('Auth flows (UI)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignInCreate.mockResolvedValue({
      status: 'complete',
      createdSessionId: 'session-1',
    });
    mockSetActive.mockResolvedValue(undefined);
    mockSignUpCreate.mockResolvedValue({ status: 'missing_requirements' });
    mockPrepareEmailAddressVerification.mockResolvedValue(undefined);
  });

  it('login: requires email+password and signs in with normalized email', async () => {
    const r = render(React.createElement(LoginScreen));

    const entrarBtnLabel1 = r.getAllByText('Entrar').slice(-1)[0];
    fireEvent.press((entrarBtnLabel1 as any).parent);
    expect(r.getByText('Ingresa tu email y contraseña.')).toBeTruthy();

    fireEvent.changeText(r.getByPlaceholderText('tu@ejemplo.com'), '  PABLO@EXAMPLE.COM ');
    fireEvent.changeText(r.getByPlaceholderText('Tu contraseña'), 'secret123');

    const entrarBtnLabel2 = r.getAllByText('Entrar').slice(-1)[0];
    fireEvent.press((entrarBtnLabel2 as any).parent);

    await waitFor(() => {
      expect(mockSignInCreate).toHaveBeenCalledWith({
        identifier: 'pablo@example.com',
        password: 'secret123',
      });
    });
    expect(mockSetActive).toHaveBeenCalledWith({ session: 'session-1' });
    expect(router.replace).toHaveBeenCalledWith('/(tabs)');
  });

  it('register: requires min 8 chars and starts email verification with names', async () => {
    const r = render(React.createElement(RegisterScreen));

    fireEvent.changeText(r.getByPlaceholderText('Juan'), 'Pablo');
    fireEvent.changeText(r.getByPlaceholderText('Pérez'), 'Baldazzi');
    fireEvent.changeText(r.getByPlaceholderText('tu@ejemplo.com'), 'pablo@example.com');
    fireEvent.changeText(r.getByPlaceholderText('Mín. 8 caracteres'), 'short');

    const crearBtnLabel1 = r.getAllByText('Crear cuenta').slice(-1)[0];
    fireEvent.press((crearBtnLabel1 as any).parent);
    expect(r.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeTruthy();

    fireEvent.changeText(r.getByPlaceholderText('Mín. 8 caracteres'), 'longenough');
    const crearBtnLabel2 = r.getAllByText('Crear cuenta').slice(-1)[0];
    fireEvent.press((crearBtnLabel2 as any).parent);

    await waitFor(() => {
      expect(mockSignUpCreate).toHaveBeenCalledWith({
        emailAddress: 'pablo@example.com',
        password: 'longenough',
        firstName: 'Pablo',
        lastName: 'Baldazzi',
      });
    });
    expect(mockPrepareEmailAddressVerification).toHaveBeenCalledWith({ strategy: 'email_code' });
    expect(r.getByText('Verifica tu email')).toBeTruthy();
  });
});
