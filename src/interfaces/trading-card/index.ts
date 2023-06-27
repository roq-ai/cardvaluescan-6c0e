import { CollectionCardInterface } from 'interfaces/collection-card';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface TradingCardInterface {
  id?: string;
  name: string;
  series: string;
  edition: string;
  features?: string;
  estimated_value?: number;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  collection_card?: CollectionCardInterface[];
  user?: UserInterface;
  _count?: {
    collection_card?: number;
  };
}

export interface TradingCardGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  series?: string;
  edition?: string;
  features?: string;
  user_id?: string;
}
