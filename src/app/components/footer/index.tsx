import React from "react";
import { Box, Container, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Footers = styled.div`
  width: 100%;
  height: 590px;
  display: flex;
  background: #343434;
  background-size: cover;
`;

export default function Footer() {
  const authMember = null;

  return (
    <Footers>
      <Container>
        <Stack flexDirection={"row"} sx={{ mt: "94px" }}>
          <Stack flexDirection={"column"} style={{ width: "340px" }}>
            <Box>
              <img width={"100px"} src={"/icons/4.png"} />
            </Box>
            <Box className={"foot-desc-txt"}>
              Qaysar and Qaynar are brothers. They live in South Korea and they
              are Uzbek! They manage a restaurant named Qaysar and Qaynar!
            </Box>
            <Box className="sns-context">
              <a
                href="https://www.facebook.com/qaysarqaynar.firidi"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={"/icons/facebook.svg"} alt="facebook" />
              </a>

              <a
                href="https://www.tiktok.com/@qaysarqaynarhalalfood?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={"/icons/tik-tok.png"} alt="twitter" />
              </a>

              <a
                href="https://www.instagram.com/qaysar_qaynarr/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={"/icons/instagram.svg"} alt="instagram" />
              </a>

              <a
                href="https://www.youtube.com/@qaysarqaynar8585"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={"/icons/youtube.svg"} alt="youtube" />
              </a>
            </Box>
          </Stack>
          <Stack sx={{ ml: "288px" }} flexDirection={"row"}>
            <Stack>
              <Box>
                <Box className={"foot-category-title"}>Bo'limlar</Box>
                <Box className={"foot-category-link"}>
                  <Link to="/">Home</Link>
                  <Link to="/products">Products</Link>
                  {authMember && <Link to="/orders">Orders</Link>}
                  <Link to="/help">Help</Link>
                </Box>
              </Box>
            </Stack>
            <Stack sx={{ ml: "100px" }}>
              <Box>
                <Box className={"foot-category-title"}>Find us</Box>
                <Box
                  flexDirection={"column"}
                  sx={{ mt: "20px" }}
                  className={"foot-category-link"}
                  justifyContent={"space-between"}
                >
                  <Box flexDirection={"row"} className={"find-us"}>
                    <span>L.</span>
                    <div>Jeonju, S. Korea</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>P.</span>
                    <div>+8210 4215 8090</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>E.</span>
                    <div>qaysar-qaynar.com</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>H.</span>
                    <div>Visit 24 hours</div>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          style={{ border: "1px solid #C5C8C9", width: "100%", opacity: "0.2" }}
          sx={{ mt: "80px" }}
        ></Stack>
        <Stack className={"copyright-txt"}>
          © Copyright LEO Global, All rights reserved.
        </Stack>
      </Container>
    </Footers>
  );
}
