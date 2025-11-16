import { Box, Container, Stack } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Settings } from "./Settings";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";
import "../../../css/userPage.css";

export default function UserPage() {
  const history = useHistory();
  const { authMember } = useGlobals();

  if (!authMember) history.push("/");

  return (
    <div
      className="user-page"
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingTop: 40 }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ alignItems: "flex-start" }}
        >
          {/* Left Side: Settings */}
          <Stack
            className="my-page-left"
            sx={{
              flex: 2,
              bgcolor: "#fff",
              p: 3,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Box display="flex" flexDirection="column">
              <Box
                className="menu-name"
                sx={{
                  fontWeight: 600,
                  fontSize: 18,
                  mb: 2,
                  color: "#1976D2",
                }}
              >
                Modify Member Details
              </Box>
              <Box className="menu-content">
                <Settings />
              </Box>
            </Box>
          </Stack>

          {/* Right Side: User Info */}
          <Stack
            className="my-page-right"
            sx={{
              flex: 1,
              bgcolor: "#fff",
              p: 3,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              alignItems: "center",
            }}
          >
            <Box
              className="order-info-box"
              sx={{ width: "100%", textAlign: "center" }}
            >
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={2}
              >
                <Box
                  className="order-user-img"
                  sx={{ position: "relative", mb: 1 }}
                >
                  <img
                    src={
                      authMember?.memberImage
                        ? `${serverApi}/${authMember.memberImage}`
                        : "/icons/default-user.svg"
                    }
                    className="order-user-avatar"
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid #1976d2",
                    }}
                  />
                  <Box
                    className="order-user-icon-box"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      bgcolor: "#1976d2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={
                        authMember?.memberType === MemberType.RESTAURANT
                          ? "/icons/restaurant.svg"
                          : "/icons/user-badge.svg"
                      }
                      style={{ width: 18, height: 18 }}
                    />
                  </Box>
                </Box>

                <span
                  className="order-user-name"
                  style={{
                    fontWeight: 600,
                    fontSize: 18,
                    color: "#333",
                  }}
                >
                  {authMember?.memberNick}
                </span>
                <span
                  className="order-user-prof"
                  style={{ fontSize: 14, color: "#666" }}
                >
                  {authMember?.memberType}
                </span>
                <span
                  className="order-user-prof"
                  style={{ fontSize: 14, color: "#666" }}
                >
                  {authMember?.memberAddress
                    ? authMember.memberAddress
                    : "no address"}
                </span>
              </Box>

              <Box
                className="user-media-box"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <a
                  href="https://www.facebook.com/100050635370139/videos/qaysar-qaynar-%EF%B8%8F01042158090-%EC%A0%84%EB%B6%81-%EC%A0%84%EC%A3%BC%EC%8B%9C-%EB%8D%95%EC%A7%84%EA%B5%AC-%EC%82%BC%EC%86%A11%EA%B8%B8-25/1365608694982125/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookIcon sx={{ color: "#1976d2", cursor: "pointer" }} />
                </a>

                <a
                  href="https://www.instagram.com/qaysar_qaynarr/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon sx={{ color: "#C13584", cursor: "pointer" }} />
                </a>

                <a
                  href="https://t.me/your-page"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TelegramIcon sx={{ color: "#0088cc", cursor: "pointer" }} />
                </a>

                <a
                  href="https://www.youtube.com/@qaynarqaysar4355"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <YouTubeIcon sx={{ color: "#FF0000", cursor: "pointer" }} />
                </a>
              </Box>

              <p
                className="user-desc"
                style={{
                  fontSize: 14,
                  color: "#555",
                  lineHeight: 1.4,
                  marginTop: 0,
                }}
              >
                {authMember?.memberDesc
                  ? authMember.memberDesc
                  : "no description"}
              </p>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
