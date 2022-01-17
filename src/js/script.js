const API_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'a32c49fc09517c91448d1166045ea031';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280/';
const API_TEST = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=a32c49fc09517c91448d1166045ea031&page=1';
//const API_SEARCH ="https://api.themoviedb.org/3/search/movie?&api_key=a32c49fc09517c91448d1166045ea031&query=";
const API_SEARCH ="https://api.themoviedb.org/3/search/movie?sort_by=popularity.desc&&api_key=a32c49fc09517c91448d1166045ea031&query=";

const mainEL = document.getElementById('main');
const formEl = document.getElementById('searchForm')
const searchEl = document.getElementById('search');

function setColor(score) {
    if (score > 7.5) return "green";
    else if (score >= 5) return "yellow";
    else if (score > 0) "red";
    else null;
}

async function getPopularMovies() {
    const response = await fetch(API_TEST);
    const responseData = await response.json();
    console.log(responseData.results[0].original_title);

    responseData.results.forEach(movie => {
        const container = document.createElement('div');
        container.classList.add('movie');
        container.innerHTML = `
            <img src="${IMG_PATH + movie.poster_path}" 
                alt="${movie.original_title}">
            <div class="movie-info">
                <h3>${movie.original_title}</h3>
                <span class="${setColor(movie.vote_average)}">
                ${movie.vote_average}</span>
            </div>`;

        //console.log(movie);
        mainEL.appendChild(container);
    })

    return responseData;
}

//getPopularMovies();

formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const textValue = searchEl.value;

    if (textValue) {
        getSearchedMovies(textValue);
        searchEl.value = "";
    }
})

async function getSearchedMovies(value) {
    mainEL.innerHTML = '';
    const response = await fetch(API_SEARCH + value);
    const responseData = await response.json();

    responseData.results.forEach(movie => {
        const container = document.createElement('div');
        container.classList.add('movie');
        container.innerHTML = `
            <img src="${getPosterImg(movie.poster_path)}" 
                alt="${movie.original_title}">
            <div class="movie-info">
                <h3>${movie.original_title}</h3>
                <span class="${setColor(movie.vote_average)}">
                ${movie.vote_average}</span>
            </div>
            <div class="overview">
            <h4>Synopysis</h4>
            ${movie.overview}
            </div>
            `;

        //console.log(movie);
        mainEL.appendChild(container);
    })
}

function getPosterImg(poster_path){
    if (poster_path) return IMG_PATH + poster_path;
    else return "noPoster.jpg";
}
