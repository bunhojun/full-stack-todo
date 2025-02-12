import { routerPaths } from '@/routes/paths.ts';

export const fetcher = async <T>(
  path: string,
  options?: RequestInit,
): Promise<T | undefined> => {
  const baseUrl = import.meta.env.VITE_BASE_URL || '';
  const url = `${baseUrl}${path}`;

  return fetch(url, {
    credentials: 'include', // to send cookies
    ...options,
  })
    .then(async (res) => {
      if (res.ok) {
        if (res.status === 204) {
          return;
        }

        if (res.headers.get('content-type')?.includes('text')) {
          return res.text();
        }

        return res.json();
      }

      if (res.status === 401) {
        // refresh
        const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        if (refreshRes.ok) {
          return fetcher<T>(path, options);
        } else {
          window.location.href = routerPaths.login;
          return;
        }
      }

      throw res;
    })
    .catch((error) => {
      alert('Error: ' + error);
      throw error;
    });
};
