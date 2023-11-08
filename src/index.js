import './sass/index.scss';
import NewsApiService from './js/api-service';
import { lightbox } from './js/lightbox';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('.search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let isShown = 0;
const newsApiService = new NewsApiService();

searchForm.addEventListener('submit', onSearch);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      onLoadMore();
    }
  });
});

observer.observe(loadMoreBtn);

function onSearch(event) {
  event.preventDefault();

  galleryContainer.innerHTML = '';
  newsApiService.query = event.currentTarget.elements.searchQuery.value.trim();
  newsApiService.resetPage();

  if (newsApiService.query === '') {
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
  onRenderGallery(hits);
}

function onLoadMore() {
  newsApiService.incrementPage();
  fetchGallery();
}

let isFirstLoad = true;

async function fetchGallery() {
  loadMoreBtn.classList.add('is-hidden');

  const result = await newsApiService.fetchGallery();
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

    loadMoreBtn.classList.add('is-hidden');
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

    loadMoreBtn.classList.remove('is-hidden');

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
