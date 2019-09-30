export const shelfService = {
  getAll,
  getByName,
  add,
  update,
  delete: _delete
};


function getAll(user) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch(`${process.env.VUE_APP_API_URL}/api/shelfs/${user}`, requestOptions)
    .then(handleResponse)
    .then(response => response.shelfs);
}

function getByName(name, user) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch(`${process.env.VUE_APP_API_URL}/api/shelf/${name}/${user}`, requestOptions).then(handleResponse);
}


function add(shelf) {
  const requestOptions = {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(shelf)
  };

  return fetch(`${process.env.VUE_APP_API_URL}/api/shelf/${shelf.name}/${shelf.user_id}`, requestOptions).then(handleResponse);
}


function update(shelf) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(shelf)
  };

  return fetch(`${process.env.VUE_APP_API_URL}/api/shelf/${shelf.name}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(shelf) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  };

  return fetch(`${process.env.VUE_APP_API_URL}/api/shelf/${shelf.name}/${shelf.user_id}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

function authHeader() {
  // return authorization header with jwt token
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.access_token) {
    return { Authorization: 'Bearer ' + user.access_token };
  } else {
    return {};
  }
}
