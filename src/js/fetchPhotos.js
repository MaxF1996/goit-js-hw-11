import axios from 'axios';

export default async function fetchPhotos(value, page) {
  const url = 'https://pixabay.com/api/';
  const key = '11240134-58b8f655e9e0f8ae8b6e8e7de';
  const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  const response = await axios.get(`${url}${filter}`);
  return response.data;
}
