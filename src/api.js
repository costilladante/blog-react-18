const API_BASE_URL = 'https://jsonplaceholder.typicode.com/posts';
const getPosts = async (postCount) => {
  const response = await fetch(`${API_BASE_URL}?_start=0&_limit=${postCount}`); // for infinite scroll

  return await response.json();
};

export { getPosts };
