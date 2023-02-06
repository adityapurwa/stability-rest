import axios from "axios";

export function createClient(apiKey: string) {
  return axios.create({
    baseURL: 'https://api.stability.ai/v1beta',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
      'User-Agent': 'stability-rest (ts)'
    },
  });
}