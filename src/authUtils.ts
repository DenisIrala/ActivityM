export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // Clear any other auth-related storage
  };
  
  export const isValidToken = (token: string | null): boolean => {
    if (!token) return false;
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };