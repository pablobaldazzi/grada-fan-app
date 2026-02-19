import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

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

const loginMock = jest.fn(async () => undefined);
const registerMock = jest.fn(async () => undefined);

jest.mock('@/lib/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: loginMock,
    register: registerMock,
  }),
}));

describe('Auth flows (UI)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('login: requires email+password and calls auth.login with normalized email', async () => {
    const r = render(React.createElement(LoginScreen));

    const entrarBtnLabel1 = r.getAllByText('Entrar').slice(-1)[0];
    fireEvent.press((entrarBtnLabel1 as any).parent);
    expect(r.getByText('Ingresa tu email y contraseña.')).toBeTruthy();

    fireEvent.changeText(r.getByPlaceholderText('tu@ejemplo.com'), '  PABLO@EXAMPLE.COM ');
    fireEvent.changeText(r.getByPlaceholderText('Tu contraseña'), 'secret123');

    const entrarBtnLabel2 = r.getAllByText('Entrar').slice(-1)[0];
    fireEvent.press((entrarBtnLabel2 as any).parent);

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('club-1', 'pablo@example.com', 'secret123');
    });
  });

  it('register: requires min 8 chars and calls auth.register with names', async () => {
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
      expect(registerMock).toHaveBeenCalledWith(
        'club-1',
        'pablo@example.com',
        'longenough',
        'Pablo',
        'Baldazzi'
      );
    });
  });
});
