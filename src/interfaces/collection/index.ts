import { CollectionCardInterface } from 'interfaces/collection-card';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CollectionInterface {
  id?: string;
  name: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  collection_card?: CollectionCardInterface[];
  user?: UserInterface;
  _count?: {
    collection_card?: number;
  };
}

export interface CollectionGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  user_id?: string;
}
