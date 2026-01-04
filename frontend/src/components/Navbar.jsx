import {
  Navbar,
  Container,
  Form,
  FormControl,
  Button,
  Dropdown
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getUser, logout } from "../utils/auth";

export default function TopNavbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const user = getUser();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    navigate(`/?q=${encodeURIComponent(search)}`);
  };

  return (
    <Navbar bg="light" fixed="top" className="shadow-sm">
      <Container fluid>

        <Button variant="light" className="me-2 fs-4" onClick={toggleSidebar}>
          ☰
        </Button>

        <Navbar.Brand
          className="fw-bold text-danger"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          ▶ YouTube
        </Navbar.Brand>

        {/* 🔍 SEARCH */}
        <Form
          className="d-flex w-50"
          onSubmit={(e) => {
            e.preventDefault();
            if (!search.trim()) return;
            navigate(`/?q=${search}`);
          }}
        >
          <FormControl
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" variant="outline-secondary">
            🔍
          </Button>
        </Form>


        {!user ? (
          <div className="d-flex gap-2">
            <Button variant="outline-primary" onClick={() => navigate("/auth")}>
              Login
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate("/auth?mode=signup")}
            >
              Sign Up
            </Button>
          </div>
        ) : (
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" className="fw-bold">
              {user.username}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate(`/channel/${user.id}`)}>
                My Channel
              </Dropdown.Item>

              <Dropdown.Item
                onClick={() => navigate(`/channel/${user.id}/videos`)}
              >
                Manage Videos
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Item
                className="text-danger"
                onClick={() => {
                  logout();
                  navigate("/");
                  window.location.reload();
                }}
              >
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        )}
      </Container>
    </Navbar>
  );
}
