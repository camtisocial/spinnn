import { Link } from "react-router-dom";
function ListPosts () {
  const blogPosts = [
    {
      title: "A Modest Proposal",
      date: "2023-10-01",
      slug: "a-modest-proposal",
    },
  ];

  return (
    <div className="Header-container">
      <br /> <br />
      <h1 className="Header"> Blog Posts </h1>
      <ul className="List">
        {blogPosts.map((post) => (
          <li key={post.slug}>
            <Link to={`posts/${post.slug}`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListPosts;
