const API_URL = 'https://api.themoviedb.org/3';
const API_MOVIE_GENERAL_PATH = 'https://api.themoviedb.org/3/movie/';
const API_TV_GENERAL_PATH = 'https://api.themoviedb.org/3/tv/';

const API_KEY = 'a32c49fc09517c91448d1166045ea031';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280/';
const API_SEARCH ="https://api.themoviedb.org/3/search/movie?sort_by=popularity.desc&&api_key=a32c49fc09517c91448d1166045ea031&query=";

const formEl = document.getElementById('searchForm')
const searchEl = document.getElementById('search');

function setColor(score) {
    if (score >= 7) return "green";
    else if (score >= 5) return "yellow";
    else if (score < 5 && score != 0) return "red";
    else return "grey";
}

async function fetchAPI(element, API_FETCH, mediaType) {
    console.log("API: " + API_FETCH);
    
    const response = await fetch(API_FETCH);
    const responseData = await response.json();

    if (responseData.results){
        responseData.results.forEach(movie => {
            const container = document.createElement('div');
            container.id = movie.id;
            container.classList.add('swiper-slide');
            if (mediaType === "movie") container.setAttribute("onclick","showFilmCard(" + container.id + ")");
            else container.setAttribute("onclick","showTvCard(" + container.id + ")");
            container.innerHTML = `
            <div class="card">
                <img src="${IMG_PATH + movie.poster_path}" 
                    alt="${ (typeof movie.title !== 'undefined') ? movie.title : movie.name }">
                <div class="card-info">
                    <span class="${setColor(movie.vote_average)}">
                    ${movie.vote_average}</span>
                </div>
            </div>`;
    
            // <p>${ (typeof movie.title !== 'undefined') ? movie.title : movie.name }</p>
    
            element.appendChild(container);
        });
    }

    else {
        const container = document.createElement('div');
        container.id = responseData.id;
        container.setAttribute("onclick","showFilmCard(" + container.id + ")");
        container.innerHTML = `
        <div class="card">
            <img src="${IMG_PATH + responseData.poster_path}" 
                alt="${responseData.original_title}">
            <div class="card-info">
                <span class="${setColor(responseData.vote_average)}">
                ${responseData.vote_average}</span>
            </div>
        </div>`;

        element.appendChild(container);
    }
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
    const el = document.getElementById('main-display');
    el.innerHTML = "";
    const el2 = document.getElementById('cunt');
    el2.innerHTML = "";
    const response = await fetch(API_SEARCH + value);
    const responseData = await response.json();

    const mainGrid = document.createElement('div');
    mainGrid.classList.add('main-grid');

    responseData.results.forEach(movie => {
        const container = document.createElement('div');
        container.classList.add('card');
        container.innerHTML = `
            <img src="${getPosterImg(movie.poster_path)}" 
                alt="${movie.title}">
            <div class="card-info">
                <span class="${setColor(movie.vote_average)}">
                ${movie.vote_average}</span>
            </div>
            `;

        //console.log(movie);
        mainGrid.appendChild(container);
        el.appendChild(mainGrid);

    })
}

function getPosterImg(poster_path){
    if (poster_path) return IMG_PATH + poster_path;
    else return "../images/noPoster.jpg";
}


/*
 * Whenever the user clicks on a card, the card's unique ID is sent to this function.
 * We are then presented with more information on the selected media and the people that 
 * have worked on the film.
 * 
 * The user can favorite or bookmark the selected movie, then view it on their profile.
 */

async function showCard(cardID, mediaType) {
    let card = document.getElementById('card-info');
    card.innerHTML = ""; let thePath = "";
    (mediaType === "movie") ? thePath = API_MOVIE_GENERAL_PATH : thePath = API_TV_GENERAL_PATH;

    localStorage.setItem('cardID', cardID); // So we can update the user's favorites and bookmarks.
    
    const responseData = await fetch(thePath + cardID + "?api_key=" + API_KEY + "&language=en-US");
    const responseCredits = await fetch(thePath + cardID + "/credits?api_key=" + API_KEY + "&language=en-US");

    console.log(API_MOVIE_GENERAL_PATH + cardID + "/credits?api_key=" + API_KEY + "&language=en-US")

    const mediaData = await responseData.json();
    const creditsData = await responseCredits.json();

    const container = document.createElement('div');
    container.classList.add('movie');

    let movieGenres = "";
    mediaData.genres.forEach(genre => {
        movieGenres += genre.name + ', ';
        }); 
    movieGenres = movieGenres.replace(/,\s*$/, "");

    let movieDirector = "";
    let movieWriters = "";
    let movieActors = "";
    
    if (creditsData.cast.length > 3){
        for (let i = 0; i < 3; ++i) {
            movieActors += creditsData.cast[i].name + ", ";
        }; movieActors = movieActors.replace(/,\s*$/, "");
    }

    creditsData.crew.forEach(member => {
        if (member.job === "Director") movieDirector += member.name + ", ";
        if (member.job === "Writer") movieWriters += member.name + ", ";
    });
    
    movieDirector = movieDirector.replace(/,\s*$/, "");
    movieWriters = movieWriters.replace(/,\s*$/, "");

    container.innerHTML = `
    <div class="menu"><i class="fas fa-times" onclick="closeButton()"></i></div> 
    <div class="movie-img" style="background-image: url('${IMG_PATH + mediaData.backdrop_path}')"></div>
        <div class="text-movie-cont">
        <div class="mr-grid">
        <div class="col1">
            <h1>${ (mediaData.title) ? mediaData.title : mediaData.name }</h1>
            <ul id="genres" class="movie-gen">
            <li>PG-13 /</li>
            <li>${mediaData.runtime} mins /</li>
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
            <p class="movie-description">${ mediaData.overview }</p>
        </div>
        </div>
        <div class="mr-grid actors-row">
        <div class="col1">
            <div class="movie-credit-type">Director(s):
            <p class="movie-credit-induvidual">${ (movieDirector) ? movieDirector : "N/A" }</p></div>
            <div class="movie-credit-type">Writers:
            <p class="movie-credit-induvidual">${ (movieWriters) ? movieWriters : "N/A" }</p></div>
            <div class="movie-credit-type">Actors:
            <p class="movie-credit-induvidual">${ (movieActors) ? movieActors : "N/A" }</p></div>
        </div>
        <div class="mr-grid action-row">
        <div class="col2"><div class="watch-btn"><h3><i class="fas fa-play"></i>WATCH TRAILER</h3></div></div>
        <div class="col6 action-btn" onclick="favButton()"><i class="fas fa-heart"></i></div>
        <div class="col6 action-btn"><i class="fas fa-bookmark"></i></div>
        <div class="col6 action-btn"><i class="fas fa-star"></i></div>
        </div>
        </div>
    </div>`;

    
 

    card.appendChild(container);
    card.classList.remove('hidden');
    
    var elements = document.getElementsByClassName('popup-container'); // get all elements
	for(var i = 0; i < elements.length; i++){
        elements[i].style.backgroundColor ='transparent ';
		elements[i].style.background = 'linear-gradient(rgba(30,27,38, 0.95), rgba(30,27,38, 0.95)), url("'+ IMG_PATH + mediaData.backdrop_path +'")';;
        elements[i].style.backgroundPostion = 'center';
        elements[i].style.backgroundSize = 'cover';
        elements[i].style.backgroundRepeat = 'repeat';
	}

    /*
    document.body.style.margin = '8px';
    document.body.style.backgroundColor ='transparent ';
    document.body.style.background = 'linear-gradient(rgba(30,27,38, 0.95), rgba(30,27,38, 0.95)), url("'+ IMG_PATH + mediaData.backdrop_path +'")';
    document.body.style.backgroundPostion = 'center';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'repeat';
    */
}

function showFilmCard(cardID) {
    showCard(cardID, "movie")
}
function showTvCard(cardID) {
    showCard(cardID, "TV");
}

function closeButton() {
    selectedCard = "";

    const card = document.getElementsByClassName('popup-container')[0];
    card.classList.add('hidden');
}

async function favButton() {
    const token = localStorage.getItem('token');
    const cardID = localStorage.getItem('cardID');

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

/*
 * Update the local storage with the logged in User.
 */

async function accountData() {
    const token = localStorage.getItem('token');

    const result = await fetch('/api/get-user-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      }).then((res) => res.json());

    if (result.status === 'ok') {
        console.log('Sucess: ' + result.status);

        let i = 0;
        let parsedData = JSON.parse(result.data);

        // Setting up the favorites section.
        for (const item of parsedData[0].favorites) {
            const API_FETCH = 'https://api.themoviedb.org/3/movie/' + item + '?api_key=' + API_KEY;
            const element = document.getElementById('user-favs');            
            fetchAPI(element, API_FETCH, "film"); ++i;
            if (i > 4) break;
        }

        localStorage.setItem('username', parsedData[0].username);
        localStorage.setItem('email', parsedData[0].email);
        localStorage.setItem('picture-path', parsedData[0].picture);
        localStorage.setItem('description', parsedData[0].description);

    } else alert(result.error);
}

function homeButton() {
    location.href = "/";
}

function logout(){
    console.log("logging out");
    localStorage.clear();
    location.href = "login";
}

function homePage() {
    const API_most_popular_films = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=a32c49fc09517c91448d1166045ea031&page=1';
    const API_most_popular_tv = 'https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=a32c49fc09517c91448d1166045ea031&page=1';
    const API_most_popular_anime = 'https://api.themoviedb.org/3/discover/tv?api_key=a32c49fc09517c91448d1166045ea031&language=en-US&sort_by=popularity.desc&page=1&with_keywords=210024';
    const API_drama_films = 'https://api.themoviedb.org/3/discover/movie?api_key=a32c49fc09517c91448d1166045ea031&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=18'
    const API_horror_films = 'https://api.themoviedb.org/3/discover/movie?api_key=a32c49fc09517c91448d1166045ea031&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=27'


    const filmsEL = document.getElementById('movies-popularity');
    const tvShowsEL = document.getElementById('tvShows-popularity');
    const animeEL = document.getElementById('anime-popularity');
    const dramaFilmsEL = document.getElementById('drama-popularity');
    const horrorFilmsEL = document.getElementById('horror-popularity')

    fetchAPI(filmsEL, API_most_popular_films, "movie");
    fetchAPI(tvShowsEL, API_most_popular_tv, "tv");
    fetchAPI(animeEL, API_most_popular_anime, "tv");
    fetchAPI(dramaFilmsEL, API_drama_films, "movie")
    fetchAPI(horrorFilmsEL, API_horror_films, "movie")
}