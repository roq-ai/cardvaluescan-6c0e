import axios from 'axios';
import queryString from 'query-string';
import { TradingCardInterface, TradingCardGetQueryInterface } from 'interfaces/trading-card';
import { GetQueryInterface } from '../../interfaces';

export const getTradingCards = async (query?: TradingCardGetQueryInterface) => {
  const response = await axios.get(`/api/trading-cards${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTradingCard = async (tradingCard: TradingCardInterface) => {
  const response = await axios.post('/api/trading-cards', tradingCard);
  return response.data;
};

export const updateTradingCardById = async (id: string, tradingCard: TradingCardInterface) => {
  const response = await axios.put(`/api/trading-cards/${id}`, tradingCard);
  return response.data;
};

export const getTradingCardById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/trading-cards/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTradingCardById = async (id: string) => {
  const response = await axios.delete(`/api/trading-cards/${id}`);
  return response.data;
};
