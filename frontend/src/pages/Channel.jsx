import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/Api";
import { Container, Button, Row, Col } from "react-bootstrap";
import VideoCard from "../components/VideoCard";

export default function Channel() {
  const { userId } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    API.get(`/channel/${userId}`).then(res => setChannel(res.data));
    API.get(`/channel/${userId}/videos`).then(res => setVideos(res.data));
  }, [userId]);

  if (!channel) return null;

  return (
    <>
      {/* 🔥 CHANNEL BANNER */}
      <div
        style={{
          height: "200px",
          background: "linear-gradient(135deg, #ff0000, #cc0000)",
        }}
      />

      <Container className="mt-4">
        {/* CHANNEL HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
            {/* Avatar */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "#ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: "bold",
              }}
            >
              {channel.user.username[0].toUpperCase()}
            </div>

            <div>
              <h3 className="fw-bold mb-1">{channel.user.username}</h3>
              <p className="text-muted mb-1">{channel.user.email}</p>
              <p className="text-muted">{channel.videoCount} videos</p>
            </div>
          </div>

          {/* UI-ONLY SUBSCRIBE */}
          <Button variant="danger" size="lg">
            Subscribe
          </Button>
        </div>

        <hr />

        {/* 🎬 CHANNEL VIDEOS */}
        <h5 className="fw-bold mb-3">Videos</h5>

        {videos.length === 0 ? (
          <p className="text-muted">No videos uploaded yet</p>
        ) : (
          <Row>
            {videos.map(video => (
              <Col key={video._id} lg={3} md={4} sm={6} className="mb-4">
                <VideoCard video={video} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}
