export const newsApiConfig = {
  apiKey: process.env.NEWS_API_KEY,
  baseUrl: process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2',
  defaultCountry: 'us',
  defaultPageSize: 20,
  maxPageSize: 100,
};

export const getNewsApiKey = (): string => {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error('NEWS_API_KEY is not configured');
  }
  return apiKey;
};
