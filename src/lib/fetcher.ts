const fetcher = (url: string, options?: RequestInit) => fetch(url, options).then((res) => res.json());

export default fetcher;
