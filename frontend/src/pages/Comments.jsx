import { useEffect, useState } from "react";
import API from "../services/Api";

export default function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    API.get(`/videos/${videoId}/comments`)
      .then(res => setComments(res.data))
      .catch(err => console.error(err));
  }, [videoId]);

  const addComment = async () => {
    if (!text.trim()) return;

    try {
      const res = await API.post(
        `/videos/${videoId}/comment`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setComments(res.data);
      setText("");
    } catch (err) {
      alert("Login required to comment");
    }
  };

  return (
    <div className="mt-4">
      <h6>{comments.length} Comments</h6>

      {token && (
        <div className="d-flex gap-2 mb-3">
          <input
            className="form-control"
            placeholder="Add a comment..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button className="btn btn-primary" onClick={addComment}>
            Comment
          </button>
        </div>
      )}

      {comments.map((c, i) => (
        <div key={i} className="mb-2">
          <strong>{c.user?.username}</strong>
          <div>{c.text}</div>
        </div>
      ))}
    </div>
  );
}
