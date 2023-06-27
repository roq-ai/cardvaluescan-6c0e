const mapping: Record<string, string> = {
  collections: 'collection',
  'collection-cards': 'collection_card',
  organizations: 'organization',
  'trading-cards': 'trading_card',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
