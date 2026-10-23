const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const MAIN_PAGE_APIS = [
  "https://api.themoviedb.org/3/movie/popular?api_key=85ade2bd722304de1124d09e0ddfd9b3&language=en-US&page=1&region=US",
  "https://api.themoviedb.org/3/movie/top_rated?api_key=85ade2bd722304de1124d09e0ddfd9b3&language=en-US&page=1&region=US",
  "https://api.themoviedb.org/3/trending/movie/week?api_key=85ade2bd722304de1124d09e0ddfd9b3",
];

/**
 * @description - Adds event listener to the "MoviesApp" logo.
 * When logo is clicked, the user will be redirected to the main page.
 */
const logo = document.querySelector(".site-logo");
logo.addEventListener("click", () => {
  goToTop();
  window.location.reload();
});

/**
 * @description - When scrolling down, the header will stick to the top and
 * a footer will appear at the bottom of the page
 */
const header = document.querySelector(".header");
const footer = document.querySelector("footer");
window.addEventListener("scroll", fixHeader);
function fixHeader() {
  if (window.scrollY > header.offsetHeight + 50) {
    header.classList.add("active");
    footer.classList.add("active");
  } else {
    header.classList.remove("active");
    footer.classList.remove("active");
    header.style.transition = "all 0.5s";
    footer.style.transition = "all 0.5s";
  }
}

/**
 * @description - Retreaves and waits for MAIN_PAGE_APIS to return data
 */
const swiperWrappers = document.querySelectorAll(".swiper-wrapper");
const getAndDisplayMovies = async (url, swiperWrapper) => {
  const res = await fetch(url);
  const data = await res.json();
  showMovies(data.results, swiperWrapper);
};

/**
 * @description - Matches each section on the main page with its corresponding API
 */
for (let i = 0; i <= 2; i++) {
  getAndDisplayMovies(MAIN_PAGE_APIS[i], swiperWrappers[i]);
}

/**
 * @description - Displays the movies on a swiper slider style layout on the main page
 */
const showMovies = (movies, collectionOrSimilarContainer) => {
  movies.forEach((movie) => {
    if (!collectionOrSimilarContainer.querySelector(`[id="${movie.id}"]`)) {
      const { poster_path, id } = movie;

      const movies = document.createElement("div");
      movies.classList.add("swiper-slide");

      movies.innerHTML = `<img src="${IMG_PATH + poster_path}">`;
      movies.setAttribute("id", id);

      collectionOrSimilarContainer.appendChild(movies);

      const allMovies = document.querySelectorAll(".swiper-slide");
      displayClickedMovie(allMovies);
    }
  });
};

/**
 * @description - Using a third party library, Swiper, this function creates a slider style layout for the
 * display of the movies on the main page
 */
const swiper = new Swiper(".swiper-container", {
  loop: true,
  breakpoints: {
    300: {
      slidesPerView: 2,
      spaceBetween: 0,
    },
    500: {
      slidesPerView: 3,
      spaceBetween: 0,
    },
    700: {
      slidesPerView: 4,
      spaceBetween: 0,
    },
    900: {
      slidesPerView: 5,
      spaceBetween: 0,
    },
    1100: {
      slidesPerView: 6,
      spaceBetween: 0,
    },
  },
});

const mainPage = document.querySelector(".main-page");
/**
 * @description - Clicking an image on the main page will get that movie's id
 */
const displayClickedMovie = async (allMovies) => {
  // swipperContainer.removeAttribute("hidden");
  allMovies.forEach((movie) => {
    movie.addEventListener("click", () => {
      const id = movie.getAttribute("id");

      mainPage.innerHTML = "";

      getAndDisplayMovie(id);
    });
  });
};

/**
 * @description - Using the movie's id, this function will fetch the movie's data
 */
const getAndDisplayMovie = async (id) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=85ade2bd722304de1124d09e0ddfd9b3&language=en-US`
  );
  const data = await res.json();
  showMovie(data);
};

/**
 * @description - Displays clicked movie container, and hides the main page container
 */
const showMovie = async (movie) => {
  goToTop();

  const {
    poster_path,
    tagline,
    title,
    overview,
    vote_average,
    release_date,
    homepage,
    belongs_to_collection,
    id,
  } = movie;

  const voteAverage = Math.round(vote_average * 10) / 10;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const releaseDate = release_date.split("-");
  const releaseDateFormatted = `${months[releaseDate[1] - 1]} ${
    releaseDate[2]
  }, ${releaseDate[0]}`;

  mainPage.innerHTML = `
    <div class="movie-container">
      <div class="movie-poster-container">
        <div class="movie-poster">
          <img src="${IMG_PATH + poster_path}">
        </div>
      </div>
      <div class="movie-info">
        <h1>${title}</h1>
        <div class="movie-div">
          <div class="div"></div>
        </div>
        <div class="movie-details">
          <p><span class="emphasize">${tagline}</span?<p>
          <p class="overview">${overview}</p>
          <p>Rating: <span class="emphasize">${voteAverage}</span></p>
          <p>Released: <span class="emphasize">${releaseDateFormatted}</span></p>
          <p>Want to watch it? click <a href="${homepage}" target="_blank" class="anchor emphasize">here</a></p>
        </div>
      </div>
    </div>

    <div class="div-container"><div class="divider"></div></div>

    <div class="all-sections-container">
    <div class="individual-section">
      <h2 class="section-title"></h2>
      <div class="swiper-container">
        <div class="swiper-wrapper"></div>
      </div>
    </div>
    </div>`;

  const collectionOrSimilarTitle = document.querySelector(".section-title");
  const swiperContainer = document.querySelector(".swiper-container");
  const swiperWrapper = document.querySelector(".swiper-wrapper");

  createSwiperSliderEffect(swiperContainer);

  hasCollection(
    belongs_to_collection,
    id,
    collectionOrSimilarTitle,
    swiperWrapper
  );
};

/**
 * @description - Using library Swiper, this function creates a slider style layout for the
 * display of similar or collection movies
 */
createSwiperSliderEffect = (swiperContainer) => {
  const swiper = new Swiper(swiperContainer, {
    loop: true,
    breakpoints: {
      300: {
        slidesPerView: 2,
        spaceBetween: 0,
      },
      600: {
        slidesPerView: 3,
        spaceBetween: 0,
      },
      900: {
        slidesPerView: 4,
        spaceBetween: 0,
      },
      1200: {
        slidesPerView: 5,
        spaceBetween: 0,
      },
      1500: {
        slidesPerView: 6,
        spaceBetween: 0,
      },
    },
  });
};

/**
 * @description - Checks whether the movie has a collection or not
 */
const hasCollection = async (
  collection,
  id,
  collectionOrSimilarTitle,
  swiperWrapper
) => {
  if (collection) {
    getMoviesInCollection(collection.id, swiperWrapper);
    collectionOrSimilarTitle.innerHTML = collection.name;
  } else if (collection === null) {
    getMoreSimilar(id, swiperWrapper);
    collectionOrSimilarTitle.innerHTML = "More like this";
  }
};

/**
 * @description - Using the movie's collection id, this function will fetch the movies in the collection
 */
const getMoviesInCollection = async (id, swiperWrapper) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/collection/${id}?api_key=85ade2bd722304de1124d09e0ddfd9b3&language=en-US`
  );
  const data = await res.json();
  const movies = data.parts;
  showMovies(movies, swiperWrapper);
};

/**
 * @description - Using the movie's id, this function will fetch movies similar to the movie that was clicked
 */
const getMoreSimilar = async (id, swiperWrapper) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/similar?api_key=85ade2bd722304de1124d09e0ddfd9b3&language=en-US&page=1`
  );
  const data = await res.json();
  const movies = data.results;
  showMovies(movies, swiperWrapper);
};

/**
 * @description - Adds event listener for enter key
 */
const search = document.querySelector(".input");
search.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    mainPage.innerHTML = "";
    // swipperContainer.setAttribute("hidden", "");

    goToTop();
    getMoviesFound();
  }
});

/**
 * @description - Fetches the movies that match the search query
 */
const getMoviesFound = async () => {
  const search = document.querySelector(".input").value;
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=85ade2bd722304de1124d09e0ddfd9b3&language=en-US&query=${search}&page=1&include_adult=false`
  );
  const data = await res.json();
  const movies = data.results.filter((movie) => movie.poster_path !== null);

  displayMoviesFound(movies);
};

/**
 * @description - Creates and displays movies that were found
 */
const displayMoviesFound = (movies) => {
  const displaySearchedWord = document.createElement("h2");
  displaySearchedWord.classList.add("section-title");
  displaySearchedWord.innerHTML = `Movies found for "${search.value}"`;

  const displaySearchedWordContainer = document.createElement("div");
  displaySearchedWordContainer.classList.add("display-searched-word-container");

  displaySearchedWordContainer.appendChild(displaySearchedWord);
  mainPage.appendChild(displaySearchedWordContainer);

  const movieContainer = document.createElement("div");
  movieContainer.classList.add("movies-found-container");

  movies.forEach((movie) => {
    const { poster_path, id } = movie;

    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movie");
    movieDiv.setAttribute("id", id);
    movieDiv.innerHTML = `<img src="${IMG_PATH + poster_path}" alt="${
      movie.title
    }">`;

    movieContainer.appendChild(movieDiv);
    mainPage.appendChild(movieContainer);

    movieDiv.addEventListener("click", () => {
      getAndDisplayMovie(id);
    });
  });

  clearSearch();
};

/**
 * @description - Helper function to move the page to the top
 */
const goToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

/**
 * @description - Helper function to clear the search input
 */
const clearSearch = () => {
  const search = document.querySelector(".input");
  search.value = "";
};
