import React, { useState } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { useGlobals } from "../../hooks/useGlobals";
import { MemberUpdateInput } from "../../../lib/types/member";
import { T } from "../../../lib/types/common";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { Messages, serverApi } from "../../../lib/config";
import MemberService from "../../services/MemberService";

export function Settings() {
  const { authMember, setAuthMember } = useGlobals();
  const [memberImage, setMemberImage] = useState<string>(
    authMember?.memberImage
      ? `${serverApi}/${authMember.memberImage}`
      : "/icons/default-user.svg"
  );

  const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>(
    {
      memberNick: authMember?.memberNick,
      memberPhone: authMember?.memberPhone,
      memberAddress: authMember?.memberAddress,
      memberDesc: authMember?.memberDesc,
      memberImage: authMember?.memberImage,
    }
  );

  //** HANDLERS **/
  const handleChange = (field: keyof MemberUpdateInput, e: T) => {
    setMemberUpdateInput({ ...memberUpdateInput, [field]: e.target.value });
  };

  const handleSubmitButton = async () => {
    try {
      if (!authMember) throw new Error(Messages.error2);

      const { memberNick, memberPhone, memberAddress, memberDesc } =
        memberUpdateInput;
      if (!memberNick || !memberPhone || !memberAddress || !memberDesc) {
        throw new Error(Messages.error3);
      }

      const member = new MemberService();
      const result = await member.updateMember(memberUpdateInput);
      setAuthMember(result);

      await sweetTopSmallSuccessAlert("Modified successfully", 700);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const handleImageViewer = (e: T) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpg", "image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      sweetErrorHandling(Messages.error5).then();
      return;
    }

    setMemberUpdateInput({ ...memberUpdateInput, memberImage: file });
    setMemberImage(URL.createObjectURL(file));
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto", // markazga
        mt: 2, // tepaga joylashtirish (oldingi mt:5 dan ozroq tepadan)
        p: 3,
        bgcolor: "#f9f9f9",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <Typography
        variant="h5"
        sx={{ mb: 4, fontWeight: 600, textAlign: "center" }}
      >
        Account Settings
      </Typography>

      {/* Profile Image */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 5,
          position: "relative",
        }}
      >
        <Box
          component="img"
          src={memberImage}
          alt="Profile"
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #1976d2",
          }}
        />
        <Button
          component="label"
          variant="contained"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            minWidth: 0,
            p: 1,
            borderRadius: "50%",
            bgcolor: "#1976d2",
            "&:hover": { bgcolor: "#115293" },
          }}
        >
          <CloudDownloadIcon sx={{ color: "#fff", fontSize: 20 }} />
          <input type="file" hidden onChange={handleImageViewer} />
        </Button>
      </Box>

      {/* Form Inputs */}
      <Stack spacing={3}>
        <Box>
          <Typography sx={{ mb: 1, fontWeight: 500 }}>Username</Typography>
          <input
            type="text"
            placeholder="Enter username"
            value={memberUpdateInput.memberNick || ""}
            onChange={(e) => handleChange("memberNick", e)}
            style={{
              width: "100%",
              padding: "10px 15px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 16,
            }}
          />
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ mb: 1, fontWeight: 500 }}>Phone</Typography>
            <input
              type="text"
              placeholder="Enter phone"
              value={memberUpdateInput.memberPhone || ""}
              onChange={(e) => handleChange("memberPhone", e)}
              style={{
                width: "100%",
                padding: "10px 15px",
                borderRadius: 6,
                border: "1px solid #ccc",
                fontSize: 16,
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography sx={{ mb: 1, fontWeight: 500 }}>Address</Typography>
            <input
              type="text"
              placeholder="Enter address"
              value={memberUpdateInput.memberAddress || ""}
              onChange={(e) => handleChange("memberAddress", e)}
              style={{
                width: "100%",
                padding: "10px 15px",
                borderRadius: 6,
                border: "1px solid #ccc",
                fontSize: 16,
              }}
            />
          </Box>
        </Stack>

        <Box>
          <Typography sx={{ mb: 1, fontWeight: 500 }}>Description</Typography>
          <textarea
            placeholder="Enter description"
            value={memberUpdateInput.memberDesc || ""}
            onChange={(e) => handleChange("memberDesc", e)}
            style={{
              width: "100%",
              padding: "10px 15px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 16,
              minHeight: 100,
              resize: "vertical",
            }}
          />
        </Box>

        {/* Save Button */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button
            variant="contained"
            sx={{ bgcolor: "#1976d2", px: 6, py: 1.5, fontSize: 16 }}
            onClick={handleSubmitButton}
          >
            Save
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
