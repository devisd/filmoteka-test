// import Styles
import "../css/styles.css";
// // SimpleLightbox
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
// Notiflix
import { Notify } from "notiflix/build/notiflix-notify-aio";
//API KEY
const KEY = "60778458bdbdfa7e14ca7e73fe4a1fef";
//BASE elements
const refs = {
  form: document.querySelector("#search-form"),
  galleryList: document.querySelector(".gallery"),
  loadMoreBtn: document.querySelector(".load-more"),
  gallery: new SimpleLightbox(".gallery a", { loop: true, enableKeyboard: true, docClose: true, }),
  poster_path: 'https://image.tmdb.org/t/p/w500',
};

refs.form.addEventListener("submit", onSearch);
// refs.loadMoreBtn.addEventListener("click", onClick);

// Disable button LOAD-MORE
refs.loadMoreBtn.setAttribute("disabled", true);

// SEARCH MOVIE FUNCTION
function onSearch(e) {
  e.preventDefault();

  // Enable button LOAD-MORE
  refs.loadMoreBtn.removeAttribute("disabled");

  // Form input value
  const movie = e.currentTarget.elements.searchQuery.value.trim();

  // Clear DIV gallery
  clearMarkup();

  // Check TRANDING or MOVIE
  if (movie === "") {
    fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${KEY}`)
      .then(response => response.json())
      .then(object => {
        console.log(object);
        totalResultCheck(object);
        return markupPhotoList(object);
      })
      .then(renderGallery)
      .catch(onError);
  } else {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${KEY}&query=${movie}`)
      .then(response => response.json())
      .then(object => {
        console.log(object);
        totalResultCheck(object);
        return markupPhotoList(object);
      })
      .then(renderGallery)
      .catch(onError);
  }
}

// Check object of Total Result
function totalResultCheck(object) {
  if (object.total_results === 0) {
    refs.loadMoreBtn.setAttribute("disabled", true);
    return Notify.failure("Sorry, there are no images matching your search query. Please try again.")
  }
  refs.loadMoreBtn.removeAttribute("disabled");
  return Notify.success(`Hooray! We found ${object.total_results} images.`);
}

// MARKUP object
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

// RENDER FUNCTION
function renderGallery(markup) {
  refs.galleryList.insertAdjacentHTML("beforeend", markup);
  refs.gallery.refresh();
}

// CLEAR DIV gallary FUNCTION
function clearMarkup() {
  refs.galleryList.innerHTML = "";
}

// ERROR FUNCTION
function onError() {
  refs.loadMoreBtn.setAttribute("disabled", true);
  return Notify.failure("Oops, that went wrong. Please try again later");
}