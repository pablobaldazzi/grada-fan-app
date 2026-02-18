/**
 * Tests for checkout payload building logic (mirrors app/cart.tsx handleCheckout).
 * We test the pure transformation: cart items with refId/type/seatIds -> API checkout items.
 */
describe('checkout payload building', () => {
  type CartItemLike = {
    id: string;
    type: 'ticket' | 'merch';
    refId?: string;
    quantity: number;
    seatIds?: string[];
  };

  function buildCheckoutItems(items: CartItemLike[]): { type: 'TICKET' | 'PRODUCT'; refId: string; quantity: number; seatIds?: string[] }[] {
    return items
      .filter((i) => i.refId)
      .map((i) => ({
        type: i.type === 'ticket' ? ('TICKET' as const) : ('PRODUCT' as const),
        refId: i.refId!,
        quantity: i.quantity,
        ...(i.seatIds?.length ? { seatIds: i.seatIds } : {}),
      }));
  }

  it('includes only items with refId', () => {
    const items: CartItemLike[] = [
      { id: '1', type: 'merch', refId: 'prod-1', quantity: 1 },
      { id: '2', type: 'merch', quantity: 1 },
    ];
    const result = buildCheckoutItems(items);
    expect(result).toHaveLength(1);
    expect(result[0].refId).toBe('prod-1');
  });

  it('maps ticket type to TICKET and merch to PRODUCT', () => {
    const items: CartItemLike[] = [
      { id: '1', type: 'ticket', refId: 'tt-1', quantity: 2, seatIds: ['s1', 's2'] },
      { id: '2', type: 'merch', refId: 'p-1', quantity: 1 },
    ];
    const result = buildCheckoutItems(items);
    expect(result[0].type).toBe('TICKET');
    expect(result[0].seatIds).toEqual(['s1', 's2']);
    expect(result[1].type).toBe('PRODUCT');
    expect(result[1]).not.toHaveProperty('seatIds');
  });

  it('omits seatIds when empty or undefined', () => {
    const items: CartItemLike[] = [
      { id: '1', type: 'ticket', refId: 'tt-1', quantity: 1 },
    ];
    const result = buildCheckoutItems(items);
    expect(result[0]).not.toHaveProperty('seatIds');
  });
});
