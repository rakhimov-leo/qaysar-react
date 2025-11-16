import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop"; // <-- shu kerak
import Fade from "@mui/material/Fade";
import { Fab, TextField } from "@mui/material";
import styled from "styled-components";
import LoginIcon from "@mui/icons-material/Login";
import { T } from "../../../lib/types/common";
import { Messages } from "../../../lib/config";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";

// Styled Components
const ModalOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 800px;
  height: 500px;
  border-radius: 15px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);

  @media (max-width: 900px) {
    flex-direction: column;
    width: 90%;
  }
`;

const ModalImg = styled.img`
  width: 50%;
  object-fit: cover;

  @media (max-width: 900px) {
    width: 100%;
    height: 200px;
  }
`;

const ModalVideo = styled.video`
  width: 50%;
  height: 100%;
  object-fit: cover;
  display: block;
  @media (max-width: 900px) {
    width: 100%;
    height: 200px;
  }
`;

const FormContainer = styled.div`
  flex: 1;
  padding: 40px 35px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FormTitle = styled.h2`
  font-size: 30px;
  font-weight: 600;
  color: #222;
  margin-bottom: 25px;
`;

const StyledTextField = styled(TextField)`
  && {
    margin-bottom: 20px;
    width: 100%;
    max-width: 320px;
  }
`;

const StyledFab = styled(Fab)`
  && {
    margin-top: 25px;
    width: 150px;
    font-weight: 600;
    text-transform: none;
  }
`;

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const { signupOpen, loginOpen, handleSignupClose, handleLoginClose } = props;
  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const { setAuthMember } = useGlobals();

  // Handlers
  const handleUsername = (e: T) => setMemberNick(e.target.value);
  const handlePhone = (e: T) => setMemberPhone(e.target.value);
  const handlePassword = (e: T) => setMemberPassword(e.target.value);

  const handlePasswordKeyDown = (e: T) => {
    if (e.key === "Enter" && signupOpen) handleSignupRequest().then();
    else if (e.key === "Enter" && loginOpen) handleLoginRequest().then();
  };

  const handleSignupRequest = async () => {
    try {
      if (!memberNick || !memberPhone || !memberPassword)
        throw new Error(Messages.error3);
      const signupInput: MemberInput = {
        memberNick,
        memberPhone,
        memberPassword,
      };
      const member = new MemberService();
      const result = await member.signup(signupInput);
      setAuthMember(result);
      handleSignupClose();
    } catch (err) {
      console.log(err);
      handleSignupClose();
      sweetErrorHandling(err).then();
    }
  };

  const handleLoginRequest = async () => {
    try {
      if (!memberNick || !memberPassword) throw new Error(Messages.error3);
      const loginInput: LoginInput = { memberNick, memberPassword };
      const member = new MemberService();
      const result = await member.login(loginInput);
      setAuthMember(result);
      handleLoginClose();
    } catch (err) {
      console.log(err);
      handleLoginClose();
      sweetErrorHandling(err).then();
    }
  };

  const renderForm = (isSignup: boolean) => (
    <FormContainer>
      <FormTitle>{isSignup ? "Signup Form" : "Login Form"}</FormTitle>
      <StyledTextField
        label="Username"
        variant="outlined"
        onChange={handleUsername}
      />
      {isSignup && (
        <StyledTextField
          label="Phone Number"
          variant="outlined"
          onChange={handlePhone}
        />
      )}
      <StyledTextField
        label="Password"
        type="password"
        variant="outlined"
        onChange={handlePassword}
        onKeyDown={handlePasswordKeyDown}
      />
      <StyledFab
        variant="extended"
        color="primary"
        onClick={isSignup ? handleSignupRequest : handleLoginRequest}
      >
        <LoginIcon sx={{ mr: 1 }} />
        {isSignup ? "Signup" : "Login"}
      </StyledFab>
    </FormContainer>
  );

  return (
    <>
      <Modal
        open={signupOpen}
        onClose={handleSignupClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <ModalOverlay>
          <Fade in={signupOpen}>
            <ModalContent>
              <ModalVideo src="/video/login-video.mp4" autoPlay loop muted />

              {renderForm(true)}
            </ModalContent>
          </Fade>
        </ModalOverlay>
      </Modal>

      <Modal
        open={loginOpen}
        onClose={handleLoginClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <ModalOverlay>
          <Fade in={loginOpen}>
            <ModalContent>
              <ModalVideo src="/video/login-video.mp4" autoPlay loop muted />

              {renderForm(false)}
            </ModalContent>
          </Fade>
        </ModalOverlay>
      </Modal>
    </>
  );
}
