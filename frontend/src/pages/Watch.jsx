import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import API from "../services/Api";
import VideoCard from "../components/VideoCard";
import Comments from "./Comments.jsx";
import { getUser } from "../utils/auth";

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();

  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const fetchVideo = async () => {
    const res = await API.get(`/videos/${id}`);
    setVideo(res.data);
    setLikes(res.data.likeCount || 0);
    setDislikes(res.data.dislikeCount || 0);
  };

  useEffect(() => {
    fetchVideo();
    API.post(`/videos/${id}/view`);

    API.get("/videos").then(res => {
      setRecommended(res.data.filter(v => v._id !== id));
    });
  }, [id]);

  const handleLike = async () => {
    if (!user) return alert("Login to like videos");
    const res = await API.post(`/videos/${id}/like`);
    setLikes(res.data.likes.length);
    setDislikes(res.data.dislikes.length);
  };

  const handleDislike = async () => {
    if (!user) return alert("Login to dislike videos");
    const res = await API.post(`/videos/${id}/dislike`);
    setLikes(res.data.likes.length);
    setDislikes(res.data.dislikes.length);
  };

  if (!video) return null;

  return (
    <Container fluid className="mt-5 pt-3">
      <Row>
        {/* MAIN VIDEO */}
        <Col md={8}>
          <video
            controls
            width="100%"
            src={`http://localhost:5000${video.videoUrl}`}
            style={{ borderRadius: "12px" }}
          />

          <h5 className="mt-3 fw-bold">{video.title}</h5>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span className="fw-semibold">
                {video.views} views
              </span>
              <div
                className="text-muted"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/channel/${video.uploader._id}`)}
              >
                {video.uploader.username}
              </div>
            </div>

            {/* LIKE / DISLIKE */}
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleLike}
              >
                👍 {likes}
              </Button>

              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleDislike}
              >
                👎 {dislikes}
              </Button>
            </div>
          </div>

          <div className="p-3 bg-light rounded mb-4">
            {video.description}
          </div>

          <Comments videoId={id} />
        </Col>

        {/* RECOMMENDED */}
        <Col md={4}>
          <h6 className="mb-3">Recommended</h6>
          {recommended.slice(0, 10).map(v => (
            <div key={v._id} className="mb-3">
              <VideoCard video={v} />
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
}
