import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function VideoCard({ video, compact = false }) {
  const navigate = useNavigate();

  return (
    <Card
      className={`border-0 video-card ${compact ? "d-flex flex-row" : ""}`}
      onClick={() => navigate(`/watch/${video._id}`)}
    >
      <div
        className="thumbnail-wrapper"
        style={compact ? { width: "168px", flexShrink: 0 } : {}}
      >
        <img
          src={`http://localhost:5000${video.thumbnailUrl}`}
          alt={video.title}
          className="thumbnail-img"
        />
      </div>

      <Card.Body className={compact ? "py-1 px-2" : "px-0 pt-2"}>
        <div className="video-title">{video.title}</div>
        <small className="text-muted">{video.uploader?.username}</small>
        <div className="text-muted small">{video.views} views</div>
      </Card.Body>
    </Card>
  );
}

