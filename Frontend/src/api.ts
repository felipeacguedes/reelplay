const UNAUTHORIZED_EVENT = 'reelplay:unauthorized'

export function onUnauthorized(handler: () => void) {
  const listener = () => handler()
  window.addEventListener(UNAUTHORIZED_EVENT, listener)
  return () => window.removeEventListener(UNAUTHORIZED_EVENT, listener)
}

export async function apiFetch(
  url: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<Response> {
  const { token, ...fetchOptions } = options

  const headers = new Headers(fetchOptions.headers)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(url, { ...fetchOptions, headers })

  if (res.status === 401) {
    localStorage.removeItem('reelplay_token')
    localStorage.removeItem('reelplay_user')
    window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT))
  }

  return res
}
