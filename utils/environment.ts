// Apply environment-specific settings such as timeout (useful for slower environments like UAT)
const envConfig = {
  dev: { home: 'https://dev.greggs.com', api: 'https://dev.api.greggs.com', timeout: 60000 },
  uat: { home: 'https://uat.greggs.com', api: 'https://uat.api.greggs.com', timeout: 60000 },
  prod: { home: 'https://www.greggs.com', api: 'https://api.greggs.com', timeout: 60000 },
};

export const ENV = envConfig.prod
