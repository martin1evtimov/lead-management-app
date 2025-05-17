// lib/auth.ts
export const mockUser = {
  username: 'admin',
  password: 'password123',
};

export function login({ username, password }: { username: string; password: string }) {
  return username === mockUser.username && password === mockUser.password;
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isAuthenticated') === 'true';
}

export function logout() {
  localStorage.removeItem('isAuthenticated');
}
