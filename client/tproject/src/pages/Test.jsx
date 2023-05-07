import { Container } from "@mui/material";
import { useEffect } from "react";

function Test() {
  useEffect(() => {
    document.title = "Test";
  }, []);

  return (
    <Container maxWidth="xl">
      <h1>Test</h1>
      <p>Welcome to the test page</p>
    </Container>
  );
}

export default Test;
