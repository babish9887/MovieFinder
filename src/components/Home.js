import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useKey } from "./useKey";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import toast from 'react-hot-toast';


const KEY="2830fe71";
const headerfiles={
  "method":"GET",
  "headers":{
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MjIxMDk4NWFhOWJiMmY1NDE4Mjk0YzM3ZGUxZmE0NSIsInN1YiI6IjY1OTkwNmI1ODliNTYxMDFhNGMzZDVkNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zfSB08vsDIqeDDwbKuXY2DzE3Y6UfXw4w1VhaSXWlQE",
    }
}
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {

  const [query, setQuery] = useState("");
  const [trendingmovies, setMovies] = useState([]);
  const [user, setUser]=useState({_id:"", name: "", email: "", password: ""})
  const {movies, error, isLoading}=useMovies(query, handletrending);

  const [watched, setWatched]=useState([]);


  const [selectedId, setSelectedId]=useState(null);
  const [isTrending, setIsTrending]=useState(false);
 
 
  function handleSelectMovie(id){
    setSelectedId((sid)=>id===selectedId? "":id);
  }

  function handletrending(){
    setIsTrending(false);
  }

  function handleCloseMovie(){
    setSelectedId("");
    document.title=`MovieFinder`;
  }

  async function handleAddWatched(movie){

    if(!user || !user._id){
      console.log("no login")
      return toast.error("Login to Add movies")
    }

    setWatched(watched=>[...watched, movie]);

    // localStorage.setItem('watched', JSON.stringify([...watched, movie]));
    const {imdbID,imdbRating, title, year, poster, runtime, userRating}=movie;
    try{
        const res = await fetch(`http://localhost:4000/api/movie/addmovie/${user._id}`,{
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({imdbID,imdbRating, title, year, poster, runtime, userRating})
        })
        
        const resdata=await res.json()
        if(resdata.status==='success'){
            toast.success("Movie added to Watch List");

        }
    } catch(e){
        console.log(e.message)
    }

  }

  async function handleDeleteWatched(id){
    try {
      const res = await fetch(`http://localhost:4000/api/movie/deletemovie/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const resdata = await res.json();
      console.log(resdata);
      if(resdata.status==='success')
          toast.success('Movie Deleted')      
      // localStorage.setItem("userId",resdata.user._id)
    } catch (e) {
      toast.error("error deleting", e.message);
    }
    setWatched((watched) => watched.filter((movie)=>movie.imdbID!==id))
    
  }
 


  useEffect(()=>{
    async function TrendingMovies(){
      try{
        const res=await fetch(`https://api.themoviedb.org/3/trending/movie/day?language=en-US`,headerfiles);
        const data=await res.json();
        setMovies(data.results);
      }catch(e){
        console.log("Something is wrong");
      }
    }

    TrendingMovies();
    setIsTrending(true);

    
    async function getUser() {
        try {
          const res = await fetch('http://localhost:4000/api/getUser', {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Cookies.get('jwt')}`
            }
          });
          const resdata = await res.json();
          setUser(resdata.user);
        } catch (e) {
          // toast.error(e.message);
          setUser({name: "", _id: "", password: " ", email: ""})
        }
      }
      getUser();



  },[])

  useEffect(()=>{


    async function getMymovies(){
      if(! user || !user._id || user._id!==""){
      try{
        console.log("Fetching My movies")
        const res = await fetch(`http://localhost:4000/api/movie/mymovies/${user._id}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        } )
        const resdata=await res.json();
        console.log(resdata)
        if(resdata.status=='success')
          setWatched(resdata.movies)
      } catch(e){
        // toast.error(e.message);
        
      }
    }
    }

    getMymovies()
  },[user])
  
 

  return (
    <>
      <NavBar>
      <Search query={query} setQuery={setQuery} setIsTrending={setIsTrending}/>
        <NumResults user={user} />
      </NavBar>

      <Main>
        <Box>
          {isTrending ? <h1 className="headings">Trending Movies</h1>: <h1 className="headings">Matched Movies</h1>}
          {isLoading && <Loader />}
          {!isLoading && !error && !isTrending && <MovieList movies={movies} onSelectMovie={handleSelectMovie}/>}
          {error && <ErrorMessage message={error} />}
          {isTrending && <TrendingMovies movies={trendingmovies} onSelectMovie={handleSelectMovie}/>}
        </Box>

        <Box>
          {selectedId ? <Moviedetails selectedId={selectedId}
           oncCloseMovie={handleCloseMovie}
           onAddWatched={handleAddWatched}
           isTrending={isTrending}
           watched={watched}/>:
          <>
            <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched}/></>}
        </Box>
      </Main>
    </>
  );
}
function Loader(){
  return <p className="loader">Loading...</p>
}

function ErrorMessage({message}){
  return <p className="error"><span>⛔</span>{message}</p>
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo" onClick={()=>window.location.reload()}>
      <span role="img">🍿</span>
      <h1>MovieFinder</h1>
    </div>
  );
}

function Search({query, setQuery}) {

  return (
    <div className="searchbox">
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) =>{ setQuery(e.target.value);
      }}
    />

    </div>

  );
}

function NumResults({ user}) {
  function handlelogout(){
    localStorage.setItem('userId', "");
    localStorage.setItem('watched', "");

    Cookies.set('jwt', "", {expires: Date.now()})
    window.location.href='/login'
  }

  // w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500
  function showToast(){
    const buttonStyle = {
      backgroundColor: "#4CAF50",
      color: "white",
       border: "none",
       borderRadius: "4px",
       cursor: "pointer",
       boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
      margin: "5px 5px 5px 8px",
      padding: '5px',
      

    };
   toast((t) => (
     <span style={{fontSize: '1.8rem'}}>

        Sure to Logout?
       <button onClick={handlelogout} style={buttonStyle}>
         logout
       </button>
     </span>
   ));
  }
  if(user){
  return (
      user.name===""?<Link className="login-logout" to="/login">Login</Link>:
    <div className="num-results" style={{display:"flex", gap: "10px",}}>
    <Link className="login-logout" onClick={showToast}>Logout</Link>
    <Link className="user" to="/profile">{user.name.split(" ")[0]}</Link>
    </div>
  );
  } else
  return  <Link className="login-logout" to="/login">Login</Link>
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
   


      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}
function TrendingMovies({movies, onSelectMovie}){
  return(
    <ul className="list list-movies">
      {movies && movies.map((movie)=>(
        <TrendingMovie movie={movie} key={movie.id} onSelectMovie={onSelectMovie}/>
      ))}
    </ul>
  )
}
function TrendingMovie({movie, onSelectMovie}){
  return (
    <li onClick={()=>onSelectMovie(movie.id)}>
      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.release_date}</span>
        </p>
      </div>
    </li>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={()=>onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function Moviedetails({watched, selectedId, oncCloseMovie, onAddWatched, isTrending}){
  const [movie,setMovie]=useState({});
  const [trendingMovie, setTrendingMovie]=useState([])
  const [isLoading, setIsLoading]=useState(false);
  const [userRating, setUserRating]=useState(0);
  const isWatched = watched.map(movie=>movie.imdbID).includes(selectedId);
  const watchedUserrating =watched.find(movie=>movie.imdbID===selectedId)?.userRating;
  const {Title: title,
     Year: year,
    Poster: poster,
  Runtime: runtime,
  imdbRating,
  Plot: plot, 
  Released: released,
  Actors: actors,
  Director: director,
  Genre: genre,
}=movie;


function handleAdd(){
  let newMovie={};
  if(!isTrending){
     newMovie={
      imdbID: selectedId,
      title, 
      year, 
      poster,
      imdbRating:Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating
    };
  }else{
    newMovie={
      imdbID: selectedId,
      title:trendingMovie.title, 
      year: trendingMovie.release_date,
      poster: `https://image.tmdb.org/t/p/w500${trendingMovie.poster_path}`,
      imdbRating: Number(trendingMovie.vote_average),
      runtime: Number(trendingMovie.runtime),
      userRating,
    }
  }
  onAddWatched(newMovie);
  oncCloseMovie();
}

useKey("Escape", oncCloseMovie);

// useEffect(
//   function() {
//     function callback(e){
//       if(e.code==="Escape"){
//         oncCloseMovie();
//       }
//     }
//     document.addEventListener("keydown", callback);
//     return function(){
//       document.removeEventListener("Keydown", callback);
//     }
//   },[oncCloseMovie]
// )

useEffect(()=>{
  function SearchMovie(){
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
        document.title=`Movie | ${data.title}`;

    }
    getMovieDetails();
  }

  async function SearchTrendingMovie(){
    setIsLoading(true);
    const response= await fetch(`https://api.themoviedb.org/3/movie/${selectedId}?language=en-US`, headerfiles)
    const data=await response.json();
    setTrendingMovie(data);
    document.title=`Movie | ${data.title}`;

      setIsLoading(false);
  }

  if(isTrending){
    SearchTrendingMovie();
  }else{
    SearchMovie();
  }
},[selectedId])

if(isTrending){
const genres=[];
{trendingMovie.genres && trendingMovie.genres.forEach(element => {
  genres.push(element.name);
})};
  return(
    <div className="details">
    {isLoading ? <Loader />:
    <>
    <header>
    <button className="btn-back"onClick={oncCloseMovie}>❎</button>
    <img src={`https://image.tmdb.org/t/p/w500${trendingMovie.poster_path}`} alt={movie.title} />
    <div className="details-overview">
      <h2>{trendingMovie.title}</h2>
      <p>{trendingMovie.release_date} &bull; {trendingMovie.runtime}</p>
      <p>{genres.join(',')}</p>
      <p><span>⭐️</span>{trendingMovie.vote_average} IMdb rating</p>
    </div>
    </header>
    <section>
    <div className="rating">
    {!isWatched ? 
    <>
     <StarRating maxRating={10} size={26} onSetRating={setUserRating}/>
    {userRating>0 && <button className="btn-add"onClick={handleAdd}>Add to Watchlist</button>}
    </>: <p>You've already rated this movie {watchedUserrating}</p>}
     </div>
     <p>Starring {actors}</p>
      <p>Directed by {director} </p>
      <p><em>{trendingMovie.overview}</em></p>
     
    </section>
    </>}
    </div>
)
} else{
  return(
      <div className="details">
      {isLoading ? <Loader />:
      <>
      <header>
      <button className="btn-back"onClick={oncCloseMovie}>❎</button>
      <img src={poster} alt={`Poster of ${movie} movie`}/>
      <div className="details-overview">
        <h2>{title}</h2>
        <p>{released} &bull; {runtime}</p>
        <p>{genre}</p>
        <p><span>⭐️</span>{imdbRating} IMdb rating</p>
      </div>
      </header>
      <section>
      <div className="rating">
      {!isWatched ? 
      <>
       <StarRating maxRating="10" size={26} onSetRating={setUserRating}/>
      {userRating>0 && <button className="btn-add"onClick={handleAdd}>Add to Watchlist</button>}
      </>: <p>You've already rated this movie {watchedUserrating}</p>}
       </div>
        <p><em>{plot}</em></p>
        <p>Starring {actors}</p>
        <p>Directed by {director} </p>
      </section>
      </>}
      </div>
  )
}
}

function WatchedSummary({ watched }) {
  const avgImdbRating = watched ? average(watched.map((movie) => movie.imdbRating)): 0;
  const avgUserRating = watched ? average(watched.map((movie) => movie.userRating)): 0;
  const avgRuntime = watched ? average(watched.map((movie) => movie.runtime)): 0;

  return (
    <div className="summary">
      <h2>Movies To Watch</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched}) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button className="btn-delete" onClick={()=>onDeleteWatched(movie.imdbID)}>Remove</button>
      </div>
    </li>
  );
}
