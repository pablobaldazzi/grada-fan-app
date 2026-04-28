jest.mock('../../lib/demo-mode', () => ({
  getUseMockData: jest.fn(),
}));

jest.mock('../../lib/http', () => ({
  http: {
    get: jest.fn(),
  },
}));

jest.mock('../../lib/mock-data', () => ({
  getMockNews: jest.fn(),
}));

import { fetchClubNews, fetchClubNewsArticle } from '../../lib/api';
import { getUseMockData } from '../../lib/demo-mode';
import { http } from '../../lib/http';
import { getMockNews } from '../../lib/mock-data';

const mockedGetUseMockData = getUseMockData as jest.Mock;
const mockedHttpGet = http.get as jest.Mock;
const mockedGetMockNews = getMockNews as jest.Mock;

describe('news API client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetUseMockData.mockReturnValue(false);
  });

  it('fetches club news from the public API', async () => {
    mockedHttpGet.mockResolvedValue({
      data: {
        items: [
          {
            id: 'news_1',
            title: 'Title',
            summary: 'Summary',
            body: 'Body',
            category: 'resultado',
            imageUrl: null,
            publishedAt: '2026-03-20T10:00:00.000Z',
            author: 'Prensa',
          },
        ],
        nextCursor: null,
      },
    });

    const result = await fetchClubNews('puerto-montt', { limit: 3 });

    expect(mockedHttpGet).toHaveBeenCalledWith('/public/clubs/puerto-montt/news', {
      params: { limit: 3 },
    });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].category).toBe('resultado');
  });

  it('fetches a single article from the public API', async () => {
    mockedHttpGet.mockResolvedValue({
      data: {
        id: 'news_1',
        title: 'Title',
        summary: 'Summary',
        body: 'Body',
        category: 'comunidad',
        imageUrl: null,
        publishedAt: '2026-03-20T10:00:00.000Z',
        author: null,
      },
    });

    const result = await fetchClubNewsArticle('puerto-montt', 'news_1');

    expect(mockedHttpGet).toHaveBeenCalledWith('/public/clubs/puerto-montt/news/news_1');
    expect(result.category).toBe('comunidad');
  });

  it('does not fall back to Puerto Montt content in mock mode', async () => {
    mockedGetUseMockData.mockReturnValue(true);
    mockedGetMockNews.mockReturnValue([]);

    const result = await fetchClubNews('rangers');

    expect(mockedGetMockNews).toHaveBeenCalledWith('rangers');
    expect(result.items).toEqual([]);
    expect(result.nextCursor).toBeNull();
  });
});
