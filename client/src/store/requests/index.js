/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

const url = "http://localhost:4000/store";


// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES


export const deletePlaylistById = (id) => {

    return fetch(url + `/playlist/${id}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        if(!response) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); 
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
     ;



}


export const getPlaylistById = (id) => {
  
  return fetch(url + `/playlist/${id}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); 
    })
    .then((data) => {
      console.log(data);
      return data; 
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

export const getPlaylistPairs = () => {
    return fetch(url + `/playlistpairs/`, {
      method: 'GET',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); 
      })
      .then((data) => {
        console.log(data);
        return data; 
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };


export const updatePlaylistById = (id, playlist) => {
  return fetch(`${url}/playlist/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ playlist })
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .catch(err => {
      console.error("Error updating playlist:", err);
    });
};

export const createPlaylist = (newListName, newSongs, userEmail) => {
  return fetch(`${url}/playlist/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: newListName,
      songs: newSongs,
      ownerEmail: userEmail
    })
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .catch(err => {
      console.error("Error creating playlist:", err);
    });
};


const apis = {
    createPlaylist,
    deletePlaylistById,
    getPlaylistById,
    getPlaylistPairs,
    updatePlaylistById
}

export default apis
