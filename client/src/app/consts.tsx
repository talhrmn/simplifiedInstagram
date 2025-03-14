const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
export const baseUrl = `${apiUrl}/${apiVersion}`;
