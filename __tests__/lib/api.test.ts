import { getTicketQrUrl } from '../../lib/api';

describe('getTicketQrUrl', () => {
  it('returns URL with path and token query param', () => {
    const url = getTicketQrUrl('abc123');
    expect(url).toContain('/public/ticket-qr');
    expect(url).toContain('token=abc123');
  });

  it('encodes special characters in token', () => {
    const token = 'token+with/special?chars';
    const url = getTicketQrUrl(token);
    expect(url).toContain('public/ticket-qr?token=');
    const param = url.split('token=')[1] ?? '';
    expect(decodeURIComponent(param)).toBe(token);
  });

  it('does not add trailing slash to path', () => {
    const url = getTicketQrUrl('x');
    expect(url).toMatch(/\/public\/ticket-qr\?token=/);
  });
});
