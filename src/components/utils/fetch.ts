type RequestInit = globalThis.RequestInit;

export async function FetchTtcData(url: string, options: RequestInit) {
  const response = await fetch(url, options);
  const data = await response.json();

  return data;
}
