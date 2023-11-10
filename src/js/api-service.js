import axios from 'axios';
export { apiService };

axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '34523545-f21683fd59bfc3e4e2549fe07';

async function apiService(query, page, perPage) {
  const { data } = await axios.get(
    `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return data;
}
