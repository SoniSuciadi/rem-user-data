import axios from 'axios';

export async function dbPocketbase(params: { q: string }) {
  const { q } = params;
  const { data } = await axios.post(`${process.env.URL_HH_POCKET_BASE}/q`, {
    q,
  });
  return data;
}

export async function crmCreate(params: { collection: string; data: object }) {
  const { collection, data } = params;
  const response = await axios.post(
    `${process.env.URL_CRM}/public/crm-service`,
    {
      collection,
      data,
      method: 'insert',
    },
  );
  console.log(response);
  return response?.data;
}
export async function crmUpdate(params: {
  collection: string;
  data: object;
  id: string;
}) {
  const { collection, data, id } = params;
  const response = await axios.post(
    `${process.env.URL_CRM}/public/crm-service`,
    {
      collection,
      data,
      method: 'update',
      id,
    },
  );
  return response?.data;
}
