import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import API from "../services/Api";
import VideoCard from "../components/VideoCard";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [searchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  useEffect(() => {
    API.get(`/videos?q=${q}`)
      .then(res => setVideos(res.data))
      .catch(console.error);
  }, [q]);

  return (
    <>
      {q && (
        <h6 className="mb-3 text-muted">
          Search results for "<b>{q}</b>"
        </h6>
      )}

      <Row className="g-3">
        {videos.map(video => (
          <Col key={video._id} xs={12} sm={6} md={4} lg={3}>
            <VideoCard video={video} />
          </Col>
        ))}
      </Row>
    </>
  );
}
