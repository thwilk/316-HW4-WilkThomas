/*
    This is our http api for all things auth, which we use to 
    send authorization requests to our back-end API. Note we`re 
    using the Axios library for doing this, which is an easy to 
    use AJAX-based library. We could (and maybe should) use Fetch, 
    which is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/



const url = 'http://localhost:4000/auth';

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /register). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES

// export const getLoggedIn = () => api.get(`/loggedIn/`);

export const getLoggedIn = () => {
    
    return fetch(url + `/loggedIn`, 
        {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            
            if(!response){ 
                console.log("error");
                throw new Error("HTTP error");
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

export const loginUser = (email, password) =>{
    return fetch(url+`/login/` , 
        {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
              },
            
            credentials: "include",
            body: JSON.stringify({
                email: email,
                password: password,
              }),
        }
    )
    .then((response) => {
            
        if(!response){ 
            console.log("error");
            throw new Error("HTTP error");
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


export const logoutUser = async () => {
    try {
      const response = await fetch(url + `/logout/`, {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return response.status;
  
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  
export const registerUser = (firstName, lastName, email, password, passwordVerify) => {

    return fetch(url + '/register/', 
        {
            headers: {
                "Content-Type": "application/json"
              },
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                passwordVerify: passwordVerify
            })
        })
        .then((response) => {

            if(!response.ok){ 
                throw new Error("HTTP error");
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



const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}

export default apis
