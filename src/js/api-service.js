import axios from 'axios';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.PER_PAGE = 40;
  }

  async fetchGallery() {
    const axiosOptions = {
      method: 'get',
      url: 'https://pixabay.com/api/',
      params: {
        key: '34523545-f21683fd59bfc3e4e2549fe07',
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        page: this.page,
        per_page: this.PER_PAGE,
      },
    };

    const response = await axios(axiosOptions);
    const data = response.data;

    return data;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
