import axios from 'axios';

export default async function imageUrlToBase64(url: string) {
  const response = await axios.get(url);
  const base64Image = Buffer.from(response.data, 'binary').toString('base64');

  return base64Image;
}
