import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import NotificationsScreen from '@/app/notifications';

const pushMock = jest.fn();

jest.mock('expo-router', () => ({
  router: {
    push: (...args: any[]) => pushMock(...args),
    back: jest.fn(),
    replace: jest.fn(),
  },
}));

jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');
  return {
    ...actual,
    useQueryClient: () => ({
      setQueryData: jest.fn(),
      invalidateQueries: jest.fn(),
    }),
    useQuery: () => ({
      data: {
        items: [
          {
            id: 'n1',
            type: 'ticket',
            title: 'Partido mañana',
            body: 'Tu partido es en 24 horas',
            readAt: null,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'n2',
            type: 'promo',
            title: 'Promo tienda',
            body: '20% off',
            readAt: null,
            createdAt: new Date().toISOString(),
          },
        ],
        unreadCount: 2,
      },
      isRefetching: false,
      refetch: jest.fn(),
    }),
    useMutation: (opts: any) => ({
      mutate: (id: string) => {
        // emulate backend returning updated notification
        const updated = { id, readAt: new Date().toISOString() };
        opts?.onSuccess?.(updated);
      },
    }),
  };
});

describe('Notifications screen', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it('routes ticket notifications to Tickets tab', async () => {
    const r = render(React.createElement(NotificationsScreen));
    fireEvent.press(r.getByText('Partido mañana'));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/(tabs)/tickets');
    });
  });

  it('routes promo notifications to Store tab', async () => {
    const r = render(React.createElement(NotificationsScreen));
    fireEvent.press(r.getByText('Promo tienda'));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/(tabs)/store');
    });
  });
});
