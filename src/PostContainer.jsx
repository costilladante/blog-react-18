import { useEffect, useState, useCallback } from 'react';
import Post from './Post';
import Modal from './Modal';
import { getPosts } from './api';

const postCountStep = 5;
const FETCH_POSTS_ERROR = 'Failed to load posts.';

const PostsContainer = () => {
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(postCountStep);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchPost = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getPosts(postCount);
      setPosts(data);
    } catch (reason) {
      setError(FETCH_POSTS_ERROR);
      setShowModal(true);
      console.log(reason);
    } finally {
      setIsLoading(false);
    }
  }, [postCount]);

  const onLoadMore = async () => {
    setPostCount((previousValue) => previousValue + postCountStep);
    await fetchPost();
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    // load posts
    fetchPost();
  }, []);

  return (
    <>
      {posts.length > 0 && (
        <div className='PostsContainer'>
          {posts.map((post, i) => (
            <Post key={post.id} title={post.title} body={post.body}></Post>
          ))}
        </div>
      )}
      ){isLoading && <div className='Loader'>Loading...</div>}
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
