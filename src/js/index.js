// import Styles
import "../css/styles.css";
// // SimpleLightbox
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
// Notiflix
import { Notify } from "notiflix/build/notiflix-notify-aio";
// import API
import FetchImages from "./fetchPhoto";

const refs = {
  form: document.querySelector("#search-form"),
  galleryList: document.querySelector(".gallery"),
  loadMoreBtn: document.querySelector(".load-more"),
  fetchPhoto: new FetchImages(),
  gallery: new SimpleLightbox(".gallery a", { loop: true, enableKeyboard: true, docClose: true, }),
  poster_path: 'https://image.tmdb.org/t/p/w500',
};

refs.loadMoreBtn.setAttribute("disabled", true);

refs.form.addEventListener("submit", onSearch);
// refs.loadMoreBtn.addEventListener("click", onClick);

function onSearch(e) {
  e.preventDefault();

  refs.loadMoreBtn.removeAttribute("disabled");

  refs.fetchPhoto.query = e.currentTarget.elements.searchQuery.value.trim();
  try {

  // fetch(`https://api.themoviedb.org/3/search/movie?api_key=60778458bdbdfa7e14ca7e73fe4a1fef&query=${searchName}&page=1`)
  if (refs.fetchPhoto.query === "") {
      refs.loadMoreBtn.setAttribute("disabled", true);
      return Notify.warning("Please enter your request");
    }

    clearMarkup();
    refs.fetchPhoto.resetPage();

    refs.fetchPhoto.fetchImages()
      .then(markupPhotoList)
      .then(renderGallery);
  } catch {
    onError();
  }
}

// function onClick() {
//   refs.fetchPhoto.fetchImages()
//     .then(object => {
//       checkEndofSearchResult(object);
//       return markupPhotoList(object);
//     })
//     .then(renderGallery);
// }

// function checkEndofSearchResult(object) {
//   if (object.hits.length < refs.fetchPhoto.per_page) {
//     refs.loadMoreBtn.setAttribute("disabled", true);
//     return Notify.info('We`re sorry, but you`ve reached the end of search results.');
//   }
// }

// function totalHitsCheck(object) {
//   if (object.total === 0) {
//     refs.loadMoreBtn.setAttribute("disabled", true);
//     return Notify.failure("Sorry, there are no images matching your search query. Please try again.")
//   }
//   refs.loadMoreBtn.removeAttribute("disabled");
//   Notify.success(`Hooray! We found ${object.totalHits} images.`);
//   checkEndofSearchResult(object);
// }

function markupPhotoList(object) {
  return object.results.map(({ poster_path, backdrop_path, title, original_title, genre_ids, vote_average, release_date, }) =>
          `<a class="gallery__item" href="https://image.tmdb.org/t/p/w500${backdrop_path}">
            <div class="photo-card">
                <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                        <b>${original_title}</b>
                    </p>
                    <p class="info-item">
                        <b>Genre</b>${genre_ids}
                    </p>
                    <p class="info-item">
                        <b>Rating</b>${vote_average}
                    </p>
                    <p class="info-item">
                        <b>Release Date</b>${release_date}
                    </p>
                </div>
            </div>
          </a>`
    ).join("");
}

function renderGallery(markup) {
  refs.galleryList.insertAdjacentHTML("beforeend", markup);
  refs.gallery.refresh();
}

function clearMarkup() {
  refs.galleryList.innerHTML = "";
}

function onError() {
  refs.loadMoreBtn.setAttribute("disabled", true);
  return Notify.failure("Oops, that went wrong. Please try again later");
}

// // ==========================================================================================================

// // Прокрутка страницы
// // Сделать плавную прокрутку страницы после запроса и отрисовки каждой следующей группы изображений. Вот тебе код подсказка, а разберись в нём самостоятельно.

// // const { height: cardHeight } = document
// //   .querySelector('.gallery')
// //   .firstElementChild.getBoundingClientRect();

// // window.scrollBy({
// //   top: cardHeight * 2,
// //   behavior: 'smooth',
// // });

// // ==========================================================================================================

// // Бесконечный скролл
// // Вместо кнопки «Load more» можно сделать бесконечную загрузку изображений при прокрутке страницы. Мы предоставлям тебе полную свободу действий в реализации, можешь использовать любые библиотеки.


