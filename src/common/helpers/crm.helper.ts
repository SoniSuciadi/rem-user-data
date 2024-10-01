import axios from 'axios';

export async function dbPocketbase(params: { q: string }) {
  const { q } = params;
  const { data } = await axios.post(`${process.env.URL_HH_POCKET_BASE}/q`, {
    q,
  });
  return data;
}
