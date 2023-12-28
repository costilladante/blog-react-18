import { useEffect, useState } from 'react';
import Post from './Post';

const postCountStep = 5;

const PostsContainer = () => {
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(postCountStep);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPost = () => {
    setIsLoading(true);
    // GET /posts?_page=7
    // GET /posts?_page=7&_limit=20
    // fetch(`https://jsonplaceholder.typicode.com/posts?_page=${pageNumber}&_limit=${maxPosts}`) // for pagination
    fetch(
      `https://jsonplaceholder.typicode.com/posts?_start=0&_limit=${postCount}`
    ) // for infinite scroll
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((reason) => {
        console.log(reason);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onLoadMore = () => {
    setPostCount((previousValue) => {
      return previousValue + postCountStep;
    });
    fetchPost();
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
      <button id='ButtonLoadMore' onClick={onLoadMore}>
        Load More
      </button>
    </>
  );
};

export default PostsContainer;
