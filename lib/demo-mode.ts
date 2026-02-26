import { config } from './config';

const useMockData = config.useMockData;

export function getUseMockData(): boolean {
  return useMockData;
}
