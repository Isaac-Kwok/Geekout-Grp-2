import { useEffect } from "react";
import { Container, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Test() {
  useEffect(() => {
    document.title = "Test";
  }, []);

  return (
    <Container maxWidth="xl">
      <h1>Test</h1>
      <p>Welcome to the test page</p>
      <Button variant="contained" color="primary" LinkComponent={Link} to="/admin/test">Test some shit</Button>
    </Container>
  );
}

export default Test;
