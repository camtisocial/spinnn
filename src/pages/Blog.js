function Blog () {
  const blogPosts = [
    {
      title: "A Modest Proposal",
      date: "2023-10-01",
      link: "/blog/a-modest-proposal",
    },
  ];

  return (
    <div className="Header-container">
      <br /> <br />
      <h1 className="Header"> Blog Posts </h1>
      <ul className="List">
        {blogPosts.map((post, index) => (
          <li key={index}>
            <a href={post.link} target="_blank" rel="noopener noreferrer">
              {post.title} - {post.date}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Blog;
