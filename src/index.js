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

async function onSearch(event) {
  event.preventDefault();
  const newQuery = event.currentTarget.searchQuery.value.trim();
  if (newQuery === query) {
    iziToast.info({
      title: 'Info',
      message: `The previous ${query} request has already been received, please enter a new search parameter.`,
      position: 'topRight',
      color: 'blue',
    });

    return;
  }
  gallery.innerHTML = '';

  if (!newQuery) {
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

  try {
    const { hits, totalHits } = await apiService(query, page, perPage);

    if (totalHits === 0) {
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again.',
        position: 'topRight',
        color: 'red',
      });
      return;
    }

    onRenderGallery(hits);
    simpleLightBox = new SimpleLightbox('.gallery a').refresh();
    iziToast.success({
      title: 'Success',
      message: `Hooray! We found ${totalHits} images !!!`,
      position: 'topRight',
      color: 'green',
    });
  } catch (error) {
    console.log(error);
  } finally {
    // searchForm.reset();
    window.addEventListener('scroll', handleScroll);
  }
}

async function handleScroll() {
  if (checkIfEndOfPage() && !isLoading) {
    isLoading = true;
    page += 1;

    try {
      const { hits, totalHits } = await apiService(query, page, perPage);
      onRenderGallery(hits);
      simpleLightBox.refresh();
      const totalPages = Math.ceil(totalHits / perPage);

      if (page >= totalPages) {
        iziToast.info({
          title: 'Info',
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
          color: 'blue',
        });
        window.removeEventListener('scroll', handleScroll);
      }
    } catch (error) {
      console.log(error);
    } finally {
      isLoading = false;
    }
  }
}

function checkIfEndOfPage() {
  return (
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
  );
}
