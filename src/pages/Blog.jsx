import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import "./Blog.css";

export default function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState("Loading...");

  useEffect(() => {
    const path = `/posts/${slug}.md`;

    fetch(path)
      .then((res) => {
        return res.text();
      })
     .then((text) => {
        setContent(text);
     })

  }, [slug]);

  return (
    <div className="blog-post">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
