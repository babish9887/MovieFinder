import { useState, useEffect } from "react";
const KEY="2830fe71";

export function useMovies(query, callback){
    const [isLoading, setIsLoading]=useState(false);
    const [error, setError]=useState("");
    const [movies, setMovies] = useState([]);

    useEffect(()=>{
        const controller = new AbortController();
        callback?.();
        async function fetchmovies(){
          try{
            setIsLoading(true);
            setError("");
          const res=await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {signal: controller.signal});
          if(!res.ok) throw new Error("Failed to Fetch");
          const data=await res.json();
      
          if(data.Response==='False') throw new Error("Movie not Found");
          setMovies(data.Search);
          setIsLoading(false);
          }catch(e){
            setError(e.message);
          } finally{
            setIsLoading(false);
          }
        }
        if(query.length<1){
          setMovies([]);
          setError("");
          return; 
        }
     
        fetchmovies();

        return function(){
            controller.abort();
        }
      },[query])
      return {movies, error, isLoading};
}