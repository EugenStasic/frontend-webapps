import config from  '../config.js';

async function fetchAPI(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Network response was not OK.");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      throw error;
    }
  }
  
  export async function checkAuth() {
    try {
      const data = await fetchAPI(config.baseUrl + '/users/checkAuth', {
        method: "GET",
      });
  
      return data.isAuthenticated;
    } catch (error) {
      console.error("Error in checkAuth:", error);
      return false;
    }
  }
  
  export async function logout() {
    try {
      await fetchAPI(config.baseUrl + '/users/logout', {
        method: "GET",
      });
    } catch (error) {
      console.error("Error in logout:", error);
    }
  }
  