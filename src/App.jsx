import { useEffect, useState } from 'react';

const Post = (props) => {
  const { title, body } = props;

  return (
    <div className='Post'>
      <label>{title}</label>
      <p>{body}</p>
    </div>
  );
};

const Main = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // load posts
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((reason) => {
        console.log(reason);
      });
  }, []);

  const renderPosts = () => {
    const postList = posts.map((post, i) => (
      <Post key={post.id} title={post.title} body={post.body}></Post>
    ));

    return <div className='PostsContainer'>{postList}</div>;
  };

  return (
    <>
      <h1 id='Title'>Blog with React 18</h1>
      {renderPosts()}
    </>
  );
};

export default Main;
