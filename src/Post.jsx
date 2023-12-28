const Post = (props) => {
  const { title, body } = props;

  return (
    <div className='Post'>
      <label>{title}</label>
      <p>{body}</p>
    </div>
  );
};

export default Post;
