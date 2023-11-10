import './sass/index.scss';
import { apiService } from './js/api-service';
import { onRenderGallery } from './js/render-gallery';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

let query = '';
let page = 1;
let simpleLightBox;
const perPage = 40;
let isLoading = false;

searchForm.addEventListener('submit', onSearch);
window.addEventListener('scroll', handleScroll);

function onSearch(event) {
  event.preventDefault();
  const newQuery = event.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';

  if (newQuery === query || newQuery === '') {
    iziToast.warning({
      title: 'Warning',
      message: 'Please, fill the main field',
      position: 'topRight',
      color: 'yellow',
    });

    return;
  }

  query = newQuery;
  page = 1;
  gallery.innerHTML = '';

  apiService(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        iziToast.error({
          title: 'Error',
          message:
            'Sorry, there are no images matching your search query. Please try again.',
          position: 'topRight',
          color: 'red',
        });
      } else {
        onRenderGallery(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        iziToast.success({
          title: 'Success',
          message: `Hooray! We found ${data.totalHits} images !!!`,
          position: 'topRight',
          color: 'green',
        });
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
      window.removeEventListener('scroll', handleScroll);
      window.addEventListener('scroll', handleScroll);
    });
}

function handleScroll() {
  if (checkIfEndOfPage() && !isLoading) {
    isLoading = true;
    page += 1;

    apiService(query, page, perPage)
      .then(({ data }) => {
        onRenderGallery(data.hits);
        simpleLightBox.refresh();

        const totalPages = Math.ceil(data.totalHits / perPage);

        if (page >= totalPages) {
          iziToast.info({
            title: 'Info',
            message:
              "We're sorry, but you've reached the end of search results.",
            position: 'topRight',
            color: 'blue',
          });
        }
      })
      .catch(error => console.log(error))
      .finally(() => {
        isLoading = false;
      });
  }
}

function checkIfEndOfPage() {
  return (
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
  );
}
