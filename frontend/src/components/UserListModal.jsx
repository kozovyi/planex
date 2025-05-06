import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "./Modal";
import "../styles/user-list.css";

export default function UserListModal({ isOpen, onClose, boardId }) {
  const [users, setUsers] = useState([]);
  const [ownerIds, setOwnerIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [isCurrentUserOwner, setIsCurrentUserOwner] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("user_email");
    if (userId) {
      setCurrentUserId(userId);
      setCurrentUserEmail(userId); 
    }

    if (isOpen && boardId) {
      fetchBoardUsers(boardId, userId);
    }
  }, [isOpen, boardId]);

  const fetchBoardUsers = async (boardId, currentUserId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/api_v1/board/by-board?board_id=${boardId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();

      const userList = data.filter((item) => item.id && item.email);
      const ownerEntries = data.filter((item) => item.role === "Owner");
      
      const owners = ownerEntries.map((item) => item.user_id);
      setUsers(userList);
      setOwnerIds(owners);
      
      const currentUserEmail = localStorage.getItem("user_email");
      
      const isOwner = ownerEntries.some((owner) =>
        userList.some(
          (user) =>
            user.id === owner.user_id && user.email === currentUserEmail
        )
      );
      
      setIsCurrentUserOwner(isOwner);
    } catch (err) {
      console.error("Error fetching board users:", err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteUser = async (userId) => {
    if (ownerIds.includes(userId)) {
      alert("Cannot remove the board owner");
      return;
    }

    if (userId === currentUserId) {
      if (
        !confirm("Are you sure you want to remove yourself from this board?")
      ) {
        return;
      }
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/api_v1/board/delete-user?user_id=${userId}&board_id=${boardId}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove user");
      }

      setUsers(users.filter((user) => user.id !== userId));

      if (userId === currentUserId) {
        onClose();
      }
    } catch (err) {
      console.error("Error removing user:", err);
      alert("Failed to remove user. Please try again.");
    }
  };

  const modalContent = (
    <div className="user-list-container">
      {loading ? (
        <p className="loading-text">Loading users...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <>
          <Typography variant="h6" component="div" className="user-list-title">
            List of users with access to the board
          </Typography>
          <List className="user-list">
            {users.length > 0 ? (
              users.map((user) => (
                <ListItem key={user.id} className="user-list-item">
                  <ListItemAvatar>
                    <Avatar className="user-avatar">
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={user.email}
                    secondary={
                      <>
                        {ownerIds.includes(user.id) && (
                          <span className="owner-badge">Owner</span>
                        )}
                        {user.email === currentUserEmail && (
                          <span className="current-user-badge">You</span>
                        )}
                      </>
                    }
                  />

                  {isCurrentUserOwner && (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={ownerIds.includes(user.id)}
                      title={
                        ownerIds.includes(user.id)
                          ? "Cannot remove owner"
                          : "Remove user"
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </ListItem>
              ))
            ) : (
              <p className="no-users-text">No users found for this board.</p>
            )}
          </List>
        </>
      )}
    </div>
  );

  return (
    <Modal
      content={modalContent}
      isOpen={isOpen}
      title="Board Users"
      onClose={onClose}
      height={400}
    />
  );
}