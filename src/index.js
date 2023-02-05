import fetchPhotos from './js/fetchPhotos';
import cardTemplate from './js/templates/photocard.hbs';

import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search__input');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const endCollectionText = document.querySelector('.end-collection-text');

function showCards(arr) {
  gallery.insertAdjacentHTML('beforeend', arr.map(item => cardTemplate(item)).join(''));
}

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionsDelay: 250,
});

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

searchForm.addEventListener('submit', searchPhotos);

async function searchPhotos(event) {
  event.preventDefault();
  searchQuery = event.currentTarget.searchQuery.value.trim();
  currentPage = 1;

  if (!searchQuery) {
    return;
  }

  try {
    const response = await fetchPhotos(searchQuery, currentPage);
    currentHits = response.hits.length;

    if (response.totalHits > 40) {
      loadBtn.classList.remove('is-hidden');
    } else {
      loadBtn.classList.add('is-hidden');
    }

    if (response.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
      gallery.innerHTML = '';
      showCards(response.hits);
      lightbox.refresh();
      endCollectionText.classList.add('is-hidden');

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * -100,
        behavior: 'smooth',
      });
    }

    if (response.totalHits === 0) {
      gallery.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadBtn.classList.add('is-hidden');
      endCollectionText.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

loadBtn.addEventListener('click', onClickLoadMoreBtn);

async function onClickLoadMoreBtn() {
  currentPage += 1;
  const response = await fetchPhotos(searchQuery, currentPage);
  showCards(response.hits);
  lightbox.refresh();
  currentHits += response.hits.length;

  if (currentHits === response.totalHits) {
    loadBtn.classList.add('is-hidden');
    endCollectionText.classList.remove('is-hidden');
  }
}
