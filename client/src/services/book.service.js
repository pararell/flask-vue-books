export const bookService = {
  getAll,
  getById,
  getInfoById,
  add,
  update,
  delete: _delete,
  searchBooks,
  showBook
};

// ${process.env.VUE_APP_API_URL}


function getAll() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch(`${process.env.VUE_APP_API_URL}/api/books`, requestOptions).then(handleResponse);
}

function getById(book_id, shelf_id, user_id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch(`${process.env.VUE_APP_API_URL}/api/book/${shelf_id}/${book_id}/${user_id}`, requestOptions)
    .then(handleResponse)
    .then(bookAll =>
      ({...bookAll.book,
        similarBooks: bookAll.similarBooks,
        rating: bookAll.rating,
        reviews: bookAll.reviews
         .replace(/(?:[^\w-])width\s*(=\s*(["'])[^"']+\2\s*|:\s*[^;]+;)/g, ' ')
         .replace("<iframe", "<iframe width='100%'")
      }));
}

function getInfoById(id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

    return fetch(`${process.env.VUE_APP_API_URL}/api/showBook/${id}`, requestOptions)
    .then(handleResponse)
    .then(book =>
      ({...book,
        similarBooks: book.similarBooks || [],
        rating: book.average_rating + (book.ratings_count ? ' (' + book.ratings_count + ')' : '') ,
        reviews: book.reviews_widget
          .replace(/(?:[^\w-])width\s*(=\s*(["'])[^"']+\2\s*|:\s*[^;]+;)/g, ' ')
          .replace("<iframe", "<iframe width='100%'")
      }));
}

function add(book) {
  const requestOptions = {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(book)
  };

  return fetch(`${process.env.VUE_APP_API_URL}/api/book/${book.shelf_id}/${book.bookId}/${book.user_id}`, requestOptions).then(handleResponse);
}

function update(book) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: {}
  };

  return fetch(`${process.env.VUE_APP_API_URL}/api/updateBook/${book.shelf_id}/${book.bookId}/${book.category_id}/${book.user_id}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(book_id, shelf_id, user_id) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  };

  return fetch(`${process.env.VUE_APP_API_URL}/api/book/${shelf_id}/${book_id}/${user_id}`, requestOptions).then(handleResponse);
}

function searchBooks(name) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch(`${process.env.VUE_APP_API_URL}/api/searchBook/${name}`, requestOptions).then(handleResponse);
}

function showBook(id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch(`${process.env.VUE_APP_API_URL}/api/showBook/${id}`, requestOptions).then(handleResponse);
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
