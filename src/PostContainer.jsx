import { useEffect, useState } from 'react';

import Post from './Post';
import Modal from './Modal';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com/posts';
const postCountStep = 5;

const PostsContainer = () => {
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(postCountStep);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchPost = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // GET /posts?_page=7
      // GET /posts?_page=7&_limit=20
      // fetch(`https://jsonplaceholder.typicode.com/posts?_page=${pageNumber}&_limit=${maxPosts}`) // for pagination
      const response = await fetch(
        `${API_BASE_URL}?_start=0&_limit=${postCount}`
      ); // for infinite scroll
      const data = await response.json();
      setPosts(data);
    } catch (reason) {
      setError('Failed to load posts.');
      setShowModal(true);
      console.log(reason);
    } finally {
      setIsLoading(false);
    }
  };

  const onLoadMore = () => {
    setPostCount((previousValue) => previousValue + postCountStep);
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    // load posts
    fetchPost();
  }, [postCount]);

  const renderPosts = () => {
    const postList = posts.map((post, i) => (
      <Post key={post.id} title={post.title} body={post.body}></Post>
    ));

    return <div className='PostsContainer'>{postList}</div>;
  };

  return (
    <>
      {renderPosts()}
      {isLoading && <div className='Loader'>Loading...</div>}
      {error && showModal && (
        <Modal onClose={onCloseModal}>
          <p>{error}</p>
        </Modal>
      )}
      <button id='ButtonLoadMore' onClick={onLoadMore}>
        Load More
      </button>
    </>
  );
};

export default PostsContainer;
