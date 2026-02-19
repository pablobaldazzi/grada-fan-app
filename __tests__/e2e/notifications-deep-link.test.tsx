import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import NotificationsScreen from '@/app/notifications';

const pushMock = jest.fn();

jest.mock('expo-router', () => ({
  router: {
    push: (...args: unknown[]) => pushMock(...args),
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
            type: 'NEW_MATCH',
            title: 'New match',
            body: 'Match 1 at Stadium',
            readAt: null,
            createdAt: new Date().toISOString(),
            data: { kind: 'new-match', eventId: 'event-123' },
          },
          {
            id: 'n2',
            type: 'PROMO',
            title: 'Store promo',
            body: '20% off',
            readAt: null,
            createdAt: new Date().toISOString(),
            data: { kind: 'promo' },
          },
          {
            id: 'n3',
            type: 'NEW_BENEFIT',
            title: 'New benefit',
            body: 'Free drink',
            readAt: null,
            createdAt: new Date().toISOString(),
            data: { kind: 'new-benefit', refId: 'benefit-456' },
          },
        ],
        unreadCount: 3,
      },
      isRefetching: false,
      refetch: jest.fn(),
    }),
    useMutation: (opts: { onSuccess?: (v: unknown) => void }) => ({
      mutate: (id: string) => {
        opts?.onSuccess?.({ id, readAt: new Date().toISOString() });
      },
    }),
  };
});

describe('Notifications deep linking', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it('routes new-match notification with eventId to match-tickets', async () => {
    const r = render(React.createElement(NotificationsScreen));
    fireEvent.press(r.getByText('New match'));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith({
        pathname: '/match-tickets',
        params: { matchId: 'event-123' },
      });
    });
  });

  it('routes promo notification with data.kind to store', async () => {
    const r = render(React.createElement(NotificationsScreen));
    fireEvent.press(r.getByText('Store promo'));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/(tabs)/store');
    });
  });

  it('routes new-benefit notification with refId to benefit-detail', async () => {
    const r = render(React.createElement(NotificationsScreen));
    fireEvent.press(r.getByText('New benefit'));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith({
        pathname: '/benefit-detail',
        params: { benefitId: 'benefit-456' },
      });
    });
  });
});
