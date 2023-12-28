import { useEffect, useState, useCallback, useMemo } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      return post.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [posts, searchQuery]);

  const onSearchChange = (event) => {
    setSearchQuery(event.target.value);
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
  }, [fetchPost]);

  return (
    <>
      <input
        id='InputSearch'
        type='text'
        placeholder='Search posts'
        value={searchQuery}
        onChange={onSearchChange}
      />
      {posts.length > 0 && (
        <div className='PostsContainer'>
          {filteredPosts.map((post) => (
            <Post key={post.id} title={post.title} body={post.body} />
          ))}
        </div>
      )}
      {isLoading && <div className='Loader'>Loading...</div>}
      {error && showModal && (
        <Modal onClose={onCloseModal}>
          <p>{error}</p>
        </Modal>
      )}
      <button id='ButtonLoadMore' disabled={isLoading} onClick={onLoadMore}>
        Load More
      </button>
    </>
  );
};

export default PostsContainer;
