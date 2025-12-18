import api from '../api';

export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    return {
      healthy: true,
      data: response.data,
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message,
    };
  }
};

export const initializeApp = async () => {
  const health = await checkApiHealth();
  
  if (!health.healthy) {
    console.warn('Backend API is not accessible. Running in offline mode.');
    // You could implement offline mode or show a warning
  }
  
  return health;
};