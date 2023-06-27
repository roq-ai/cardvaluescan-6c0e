import axios from 'axios';
import queryString from 'query-string';
import { CollectionCardInterface, CollectionCardGetQueryInterface } from 'interfaces/collection-card';
import { GetQueryInterface } from '../../interfaces';

export const getCollectionCards = async (query?: CollectionCardGetQueryInterface) => {
  const response = await axios.get(`/api/collection-cards${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCollectionCard = async (collectionCard: CollectionCardInterface) => {
  const response = await axios.post('/api/collection-cards', collectionCard);
  return response.data;
};

export const updateCollectionCardById = async (id: string, collectionCard: CollectionCardInterface) => {
  const response = await axios.put(`/api/collection-cards/${id}`, collectionCard);
  return response.data;
};

export const getCollectionCardById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/collection-cards/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCollectionCardById = async (id: string) => {
  const response = await axios.delete(`/api/collection-cards/${id}`);
  return response.data;
};
