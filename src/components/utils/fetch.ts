type RequestInit = globalThis.RequestInit;

export async function FetchTtcData(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    return { data, error: undefined };
  } catch (e) {
    return { data: undefined, error: Error(`${e}`) };
  }
}
