// Save JWT token to localStorage
export function saveToken(token) {
  localStorage.setItem('jwt', token);
}

// Get JWT token from localStorage
export function getToken() {
  return localStorage.getItem('jwt');
}

// Remove JWT token from localStorage (logout)
export function removeToken() {
  localStorage.removeItem('jwt');
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!getToken();
}