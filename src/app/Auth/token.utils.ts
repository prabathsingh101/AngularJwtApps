export function getTokenExpiry(token: string): Date | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return null;
    return new Date(payload.exp * 1000); // exp is in seconds
  } catch {
    return null;
  }
}
