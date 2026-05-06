import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { fetchAllUsers, removeUser } from "../../store/slices/userSlice";
import EditUserModal from "../../components/editUserModel";

const UsersPage = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.user);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(removeUser(id));
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{fontWeight:"bold"}} gutterBottom>
        User Management
      </Typography>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid #eee" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#1976D2" }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {Array.isArray(user.roles) &&
                  typeof user.roles[0] === "object"
                    ? user.roles.map((role: any) => (
                        <Chip
                          key={role._id}
                          label={role.name}
                          size="small"
                          sx={{ mr: 0.5, backgroundColor: "#1976D2" }}
                        />
                      ))
                    : "No Roles Assigned"}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(user)} color="primary">
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(user._id)}
                    color="error"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedUser && (
        <EditUserModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
        />
      )}
    </Box>
  );
};

export default UsersPage;
