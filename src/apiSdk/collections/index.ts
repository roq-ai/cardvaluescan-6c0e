import axios from 'axios';
import queryString from 'query-string';
import { CollectionInterface, CollectionGetQueryInterface } from 'interfaces/collection';
import { GetQueryInterface } from '../../interfaces';

export const getCollections = async (query?: CollectionGetQueryInterface) => {
  const response = await axios.get(`/api/collections${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCollection = async (collection: CollectionInterface) => {
  const response = await axios.post('/api/collections', collection);
  return response.data;
};

export const updateCollectionById = async (id: string, collection: CollectionInterface) => {
  const response = await axios.put(`/api/collections/${id}`, collection);
  return response.data;
};

export const getCollectionById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/collections/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCollectionById = async (id: string) => {
  const response = await axios.delete(`/api/collections/${id}`);
  return response.data;
};
