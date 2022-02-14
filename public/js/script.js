const API_URL = 'https://api.themoviedb.org/3';
const API_MOVIE_GENERAL_PATH = 'https://api.themoviedb.org/3/movie/';

const API_KEY = 'a32c49fc09517c91448d1166045ea031';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280/';
const API_TV_shows = 'https://api.themoviedb.org/3/tv/popular?api_key=a32c49fc09517c91448d1166045ea031&language=en-US&page=1';
const API_SEARCH ="https://api.themoviedb.org/3/search/movie?sort_by=popularity.desc&&api_key=a32c49fc09517c91448d1166045ea031&query=";

const formEl = document.getElementById('searchForm')
const searchEl = document.getElementById('search');

function setColor(score) {
    if (score >= 7) return "green";
    else if (score >= 5) return "yellow";
    else if (score < 5 && score != 0) return "red";
    else return "grey";
}

const API_FETCH_M = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=a32c49fc09517c91448d1166045ea031&page=1';
const API_FETCH_TV = 'https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=a32c49fc09517c91448d1166045ea031&page=1';

const movies = document.getElementById('movies-popularity');
const tv = document.getElementById('tvShows-popularity');

fetchAPI(movies, API_FETCH_M);
fetchAPI(tv, API_FETCH_TV);

async function fetchAPI(element, API_FETCH) {
    console.log("nigger");
    console.log("the element: " + element + "\nAPI: " + API_FETCH);
    
    const response = await fetch(API_FETCH);
    const responseData = await response.json();

    responseData.results.forEach(movie => {
        const container = document.createElement('div');
        container.id = movie.id;
        container.classList.add('swiper-slide');
        container.setAttribute("onclick","showCard(" + container.id + ")");
        container.innerHTML = `
        <div class="card">
            <img src="${IMG_PATH + movie.poster_path}" 
                alt="${movie.original_title}">
            <div class="card-info">
                <span class="${setColor(movie.vote_average)}">
                ${movie.vote_average}</span>
                <p>${movie.original_title}</p>
            </div>
        </div>`;

        element.appendChild(container);
    });
}

async function getPopularAnime() {
    const API_FETCH = 'https://api.themoviedb.org/3/discover/movie?api_key=a32c49fc09517c91448d1166045ea031&language=en-US&sort_by=popularity.desc&page=1&with_keywords=210024';
    const response = await fetch(API_FETCH);
    const responseData = await response.json();

    responseData.results.forEach(movie => {
        const container = document.createElement('div');
        container.id = movie.id;
        container.classList.add('swiper-slide');
        container.setAttribute("onclick","showCard(" + container.id + ")");
        container.innerHTML = `
        <div class="card">
            <img src="${IMG_PATH + movie.poster_path}" 
                alt="${movie.original_title}">
            <div class="card-info">
                <span class="${setColor(movie.vote_average)}">
                ${movie.vote_average}</span>
                <p>${movie.title}</p>
            </div>
        </div>`;

        document.getElementById('anime-popularity').appendChild(container);    
    });
}

formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const textValue = searchEl.value;

    if (textValue) {
        getSearchedMovies(textValue);
        searchEl.value = "";
    }
})

async function getSearchedMovies(value) {
    popularMoviesEL.innerHTML = '';
    const response = await fetch(API_SEARCH + value);
    const responseData = await response.json();

    responseData.results.forEach(movie => {
        const container = document.createElement('div');
        container.classList.add('card');
        container.innerHTML = `
            <img src="${getPosterImg(movie.poster_path)}" 
                alt="${movie.original_title}">
            <div class="card-info">
                <p>${movie.original_title}</p>
                <span class="${setColor(movie.vote_average)}">
                ${movie.vote_average}</span>
            </div>
            `;

        //console.log(movie);
        popularMoviesEL.appendChild(container);
    })
}

function getPosterImg(poster_path){
    if (poster_path) return IMG_PATH + poster_path;
    else return "../images/noPoster.jpg";
}


async function showCard(cardID) {
    let card = document.getElementById('card-info');
    card.innerHTML = "";
    localStorage.setItem('cardID', cardID)
    
    const response1 = await fetch(API_MOVIE_GENERAL_PATH + cardID + "?api_key=" + API_KEY + "&language=en-US");
    const response2 = await fetch(API_MOVIE_GENERAL_PATH + cardID + "/credits?api_key=" + API_KEY + "&language=en-US");
    console.log(API_MOVIE_GENERAL_PATH + cardID + "/credits?api_key=" + API_KEY + "&language=en-US")

    const movieData = await response1.json();
    const creditsData = await response2.json();

    const container = document.createElement('div');
    container.classList.add('movie');

    let movieGenres = "";
    movieData.genres.forEach(genre => {
        movieGenres += genre.name + ', ';
        }); 
    movieGenres = movieGenres.replace(/,\s*$/, "");

    let movieDirector = "";
    let movieWriters = "";
    let movieActors = "";
    
    for (let i = 0; i < 3; ++i) {
        movieActors += creditsData.cast[i].title + ", ";
    }; movieActors = movieActors.replace(/,\s*$/, "");


    creditsData.crew.forEach(member => {
        if (member.job === "Director") movieDirector += member.title + ", ";
        if (member.job === "Writer") movieWriters += member.title + ", ";
    });
    
    movieDirector = movieDirector.replace(/,\s*$/, "");
    movieWriters = movieWriters.replace(/,\s*$/, "");

    container.innerHTML = `
    <div class="menu"><i class="fas fa-times" onclick="closeButton()"></i></div> 
    <div class="movie-img" style="background-image: url('${IMG_PATH + movieData.backdrop_path}')"></div>
        <div class="text-movie-cont">
        <div class="mr-grid">
        <div class="col1">
            <h1>${movieData.title}</h1>
            <ul id="genres" class="movie-gen">
            <li>PG-13 /</li>
            <li>${movieData.runtime} mins /</li>
            <li>${movieGenres}</li>
            </ul>
        </div>
        </div>
        <div class="mr-grid summary-row">
        <div class="col2">
            <h5>SUMMARY</h5>
        </div>
        </div>
        <div class="mr-grid">
        <div class="col1">
            <p class="movie-description">${movieData.overview}</p>
        </div>
        </div>
        <div class="mr-grid actors-row">
        <div class="col1">
            <div class="movie-credit-type">Director(s):
            <p class="movie-credit-induvidual">${ movieDirector }</p></div>
            <div class="movie-credit-type">Writers:
            <p class="movie-credit-induvidual">${ movieWriters }</p></div>
            <div class="movie-credit-type">Actors:
            <p class="movie-credit-induvidual">${ movieActors }</p></div>
        </div>
        <div class="mr-grid action-row">
        <div class="col2"><div class="watch-btn"><h3><i class="fas fa-play"></i>WATCH TRAILER</h3></div></div>
        <div class="col6 action-btn" onclick="favButton()"><i class="fas fa-heart"></i></div>
        <div class="col6 action-btn"><i class="fas fa-bookmark"></i></div>
        <div class="col6 action-btn"><i class="fas fa-star"></i></div>
        </div>
        </div>
    </div>`;

    
    let dp = document.getElementById('general-display');
    dp.classList.add('hidden');

    card.appendChild(container);
    card.classList.remove('hidden');
    
    document.body.style.margin = '8px';
    document.body.style.backgroundColor ='transparent ';
    document.body.style.background = 'linear-gradient(rgba(30,27,38, 0.95), rgba(30,27,38, 0.95)), url("'+ IMG_PATH + movieData.backdrop_path +'")';
    document.body.style.backgroundPostion = 'center';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'repeat';
}

function closeButton() {
    selectedCard = "";
    window.location.reload(true);
}

async function favButton() {

    const token = localStorage.getItem('token');
    const cardID = localStorage.getItem('cardID');

    console.log("token: " + token);
    console.log("the id: " + cardID);

    
    const result = await fetch('/api/update-fav', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        cardID
      })
    }).then((res) => res.json());

    if (result.status === 'ok') {
      alert('Sucess');
    } else alert(result.error);
}
