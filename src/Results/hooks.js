// hooks.js
import { useState, useEffect } from "react";
function useFetch(url) {

  /*fetch(url,
  {
      method: "GET",
      headers: {"Content-Type":"application/json"},
      mode: 'no-cors'
  })
  .then(function(res){

      // $("#main-content").fadeOut(2000);
      // $("#viz_link_container").fadeIn(2000);

  })
  .then(function(data){
    console.log( "aas"+JSON.stringify( data ))
  });*/
  // console.log(url);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  async function fetchUrl() {
    console.log(url);
    const response = await fetch(url,{method: 'GET'});
    const json = await response.json();

    setData(json);
    setLoading(false);
  }
  useEffect(() => {
    fetchUrl();
  }, []);
  console.log(data);
  if ( data.status === 1) {
    // console.log(data.rows.length);
    return [data.rows, loading,data.rows.length];
  } else {
    return [data.rows, loading,0];
  }


}
export { useFetch };
