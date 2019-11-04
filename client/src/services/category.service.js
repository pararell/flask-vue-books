export const categoryService = {
  getAll,
  getById,
  add,
  update,
  delete: _delete
};


function getAll(user) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch(`${process.env.VUE_APP_API_URL}/api/categories/${user}`, requestOptions)
    .then(handleResponse)
    .then(response => response.categories);
}

function getById(id, user) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch(`${process.env.VUE_APP_API_URL}/api/category/${id}/${user}`, requestOptions).then(handleResponse);
}


function add(category) {
  const requestOptions = {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  };

  return fetch(`${process.env.VUE_APP_API_URL}/api/addCategory/${category.name}/${category.user_id}`, requestOptions).then(handleResponse);
}


function update(category, book_id) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: {}
  };
  return fetch(`${process.env.VUE_APP_API_URL}/api/updateCategory/${category.id}/${category.user_id}/${category.book_id}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(category) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  };

  return fetch(`${process.env.VUE_APP_API_URL}/api/category/${category.id}/${category.user_id}`, requestOptions).then(handleResponse);
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
