import { useEffect, useState } from "react";
import API from "../services/Api";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Modal,
  Form
} from "react-bootstrap";
import { getUser } from "../utils/auth";

export default function ManageVideos() {
  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    category: "General",
    video: null,
    thumbnail: null
  });
  const [editingVideo, setEditingVideo] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    tags: "",
    category: ""
  });
  const [newThumbnail, setNewThumbnail] = useState(null);
  const [newVideoFile, setNewVideoFile] = useState(null);
  const currentUser = getUser();

  /* ================= LOAD MY VIDEOS ================= */

  const fetchVideos = async () => {
    const res = await API.get("/videos/my/videos");
    setVideos(res.data);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  /* ================= OPEN MODAL ================= */

  const openCreate = () => {
    setIsEdit(false);
    setForm({
      title: "",
      description: "",
      tags: "",
      category: "General",
      video: null,
      thumbnail: null
    });
    setShowModal(true);
  };

  const openEdit = (video) => {
    setIsEdit(true);
    setSelectedVideo(video);
    setForm({
      title: video.title,
      description: video.description,
      tags: video.tags.join(", "),
      category: video.category,
      video: null,
      thumbnail: null
    });
    setShowModal(true);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    try {
      const data = new FormData();

      data.append("title", form.title);
      data.append("description", form.description);
      data.append("tags", form.tags);
      data.append("category", form.category);

      if (form.video) data.append("video", form.video);
      if (form.thumbnail) data.append("thumbnail", form.thumbnail);

      if (isEdit) {
        await API.put(`/videos/${selectedVideo._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await API.post("/videos/upload", data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      setShowModal(false);
      fetchVideos();
    } catch (err) {
      console.error(err);
      alert("Upload / Update failed");
    }
  };


  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this video?")) return;
    await API.delete(`/videos/${id}`);
    fetchVideos();
  };

  return (
    <Container className="mt-5 pt-4">
      <div className="d-flex justify-content-between mb-4">
        <h4>Manage Videos</h4>
        <Button variant="danger" onClick={openCreate}>
          Upload New Video
        </Button>
      </div>

      {videos.length === 0 ? (
        <p className="text-muted">No videos found</p>
      ) : (
        <Row>
          {videos.map(video => (
            <Col md={4} lg={3} key={video._id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  src={`http://localhost:5000${video.thumbnailUrl}`}
                  style={{ height: 160, objectFit: "cover" }}
                />

                <Card.Body>
                  <Card.Title className="fs-6">
                    {video.title}
                  </Card.Title>

                  <div className="d-flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => openEdit(video)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(video._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* ================= MODAL ================= */}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEdit ? "Edit Video" : "Upload Video"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Control
              className="mb-2"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <Form.Control
              className="mb-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <Form.Control
              className="mb-2"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />

            <Form.Select
              className="mb-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option>General</option>
              <option>Education</option>
              <option>Music</option>
              <option>Sports</option>
            </Form.Select>

            Video
            <Form.Control
              type="file"
              className="mb-2"
              accept="video/*"
              onChange={(e) =>
                setForm({ ...form, video: e.target.files[0] })
              }
            />

            Thumbnail
            <Form.Control
              type="file"
              className="mb-2"
              accept="image/*"
              onChange={(e) =>
                setForm({ ...form, thumbnail: e.target.files[0] })
              }
            />

            {isEdit && (
              <small className="text-muted">
                Leave files empty if you don’t want to replace existing video or thumbnail
              </small>
            )}

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSubmit}>
            {isEdit ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
