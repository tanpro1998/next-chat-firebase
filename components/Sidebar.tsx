import {
  AccountCircleOutlined,
  Message,
  MoreVert,
  Logout,
  Search,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { addDoc, collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { Conversation } from "../interfaces";
import * as EmailValidator from "email-validator";
import { signOut } from "firebase/auth";
import ConversationSelect from "./ConversationSelect";

const Container = styled.div`
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  border-right: 1px solid whitesmoke;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 15px;
  background-color: white;
  border-bottom: 1px solid whitesmoke;
`;
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
`;
const SearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
`;
const ButtonContainer = styled(Button)`
  width: 100%;
  border-top: 1px solid whitesmoke;
  border-bottom: 1px solid whitesmoke;
`;
const Avatar = styled(AccountCircleOutlined)``;

export default function Sidebar() {
  const [loggedInUser, _loading, _error] = useAuthState(auth);

  const [isOpenNewConversationDialog, setIsOpenNewConversationDialog] =
    useState(false);

  const [recipientEmail, setRecipientEmail] = useState("");

  const toggleNewConversationDialog = (isOpen: boolean) => {
    setIsOpenNewConversationDialog(isOpen);
    if (!isOpen) setRecipientEmail("");
  };

  const closeNewConversationDialog = () => {
    toggleNewConversationDialog(false);
  };

  // check if conversation already exists between the current logged in user and recipient
  const queryGetConversationsForCurrentUser = query(
    collection(db, "conversations"),
    where("users", "array-contains", loggedInUser?.email)
  );
  const [conversationsSnapshot, __loading, __error] = useCollection(
    queryGetConversationsForCurrentUser
  );

  const isConversationAlreadyExists = (recipientEmail: string) =>
    conversationsSnapshot?.docs.find((conversation) =>
      (conversation.data() as Conversation).users.includes(recipientEmail)
    );

  const isInvitingSelf = recipientEmail === loggedInUser?.email;

  const createConversation = async () => {
    if (!recipientEmail) return;

    if (
      EmailValidator.validate(recipientEmail) &&
      !isInvitingSelf &&
      !isConversationAlreadyExists(recipientEmail)
    ) {
      // Add conversation user to db "conversations" collection
      // A conversation is between the currently logged in user and the user invited.

      await addDoc(collection(db, "conversations"), {
        users: [loggedInUser?.email, recipientEmail],
      });
    }

    closeNewConversationDialog();
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("ERROR LOGGING OUT", error);
    }
  };
  return (
    <Container>
      <Header>
        <Avatar />
        <div>
          <IconButton>
            <Message />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
          <IconButton onClick={logout}>
            <Logout />
          </IconButton>
        </div>
      </Header>
      <SearchContainer>
        <Search />
        <SearchInput placeholder="Search in conversation" />
      </SearchContainer>
      <ButtonContainer
        onClick={() => {
          toggleNewConversationDialog(true);
        }}
      >
        enter a new conversation
      </ButtonContainer>
      {conversationsSnapshot?.docs.map((conversation) => (
        <ConversationSelect
          key={conversation.id}
          id={conversation.id}
          conversationUsers={(conversation.data() as Conversation).users}
        />
      ))}
      <Dialog
        open={isOpenNewConversationDialog}
        onClose={closeNewConversationDialog}
      >
        <DialogTitle>New Conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a Google email address for the user you wish to chat
            with
          </DialogContentText>
          <TextField
            autoFocus
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => {
              setRecipientEmail(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNewConversationDialog}>Cancel</Button>
          <Button disabled={!recipientEmail} onClick={createConversation}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
