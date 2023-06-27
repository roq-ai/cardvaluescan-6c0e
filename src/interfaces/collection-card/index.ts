import { CollectionInterface } from 'interfaces/collection';
import { TradingCardInterface } from 'interfaces/trading-card';
import { GetQueryInterface } from 'interfaces';

export interface CollectionCardInterface {
  id?: string;
  collection_id?: string;
  card_id?: string;
  created_at?: any;
  updated_at?: any;

  collection?: CollectionInterface;
  trading_card?: TradingCardInterface;
  _count?: {};
}

export interface CollectionCardGetQueryInterface extends GetQueryInterface {
  id?: string;
  collection_id?: string;
  card_id?: string;
}
