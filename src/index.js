import './sass/index.scss';
import ApiService from './js/api-service';
import { lightbox } from './js/lightbox';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('.search-form');
const galleryContainer = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

function toggleClass(element, isVisible) {
  element.classList.toggle('is-hidden', !isVisible);
}

let isShown = 0;
const api = new ApiService();

searchForm.addEventListener('submit', onSearch);

function onSearch(event) {
  event.preventDefault();
  galleryContainer.innerHTML = '';
  api.query = event.currentTarget.elements.searchQuery.value.trim();
  api.resetPage();

  if (api.query === '') {
    iziToast.warning({
      title: 'Warning',
      message: 'Please, fill the main field',
      position: 'topRight',
      color: 'yellow',
    });

    return;
  }

  event.currentTarget.reset();

  isShown = 0;
  fetchGallery();
}

let isFirstLoad = true;

async function fetchGallery() {
  toggleClass(loader, true);
  const result = await api.fetchGallery();
  const { hits, total } = result;
  isShown += hits.length;

  if (!hits.length) {
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
  isShown += hits.length;

  if (isShown < total) {
    iziToast.success({
      title: 'Success',
      message: `Hooray! We found ${total} images !!!`,
      position: 'topRight',
      color: 'green',
    });

    if (!isFirstLoad) {
      const { height: cardHeight } =
        galleryContainer.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    isFirstLoad = false;
  }

  if (isShown >= total) {
    iziToast.info({
      title: 'Info',
      message: "We're sorry, but you've reached the end of search results.",
      position: 'topRight',
      color: 'blue',
    });
  }
  toggleClass(loader, false);
}

function onRenderGallery(elements) {
  const markup = elements
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
       <div class="photo-card">
       <a href="${largeImageURL}">
       <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
       </a>
       <div class="info">
       <p class="info-item"><b>Likes</b>${likes}</p>
       <p class="info-item"><b>Views</b>${views}</p>
       <p class="info-item"><b>Comments</b>${comments}</p>
       <p class="info-item"><b>Downloads</b>${downloads}</p>
       </div>
       </div>`;
      }
    )
    .join('');
  galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function onLoadMore() {
  api.incrementPage();
  fetchGallery();
}

function checkIfEndOfPage() {
  return (
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
  );
}

function showLoadMorePage() {
  if (checkIfEndOfPage()) {
    onLoadMore();
  }
}

window.addEventListener('scroll', showLoadMorePage);
