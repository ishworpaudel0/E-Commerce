import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks/storeHook";
import { updateUserDetails, updateUserRoles } from "../store/slices/userSlice";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  outline: 0,
};

const EditUserModal = ({ open, onClose, user }: any) => {
  const dispatch = useAppDispatch();
  const currentUserRoles = useAppSelector((state) => state.auth.roles);

  // Authorization check logic
  const isSuperAdmin = currentUserRoles.some(
    (role: any) =>
      (typeof role === "string" ? role : role.name) === "Super_Admin",
  );

  // Map populated roles
  const currentRoleNames = user.roles.map((r: any) =>
    typeof r === "string" ? r : r.name,
  );

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      roles: currentRoleNames,
    },
  });

  const selectedRoles = watch("roles");

  const onSubmit = async (data: any) => {
    try {
      await dispatch(
        updateUserDetails({
          id: user._id,
          data: { name: data.name, email: data.email },
        }),
      ).unwrap();

      if (isSuperAdmin) {
        await dispatch(
          updateUserRoles({
            id: user._id,
            roles: data.roles,
          }),
        ).unwrap();
      }

      onClose();
    } catch (error) {
      console.error("Failed to save user changes:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-user-title"
      aria-describedby="edit-user-form"
    >
      <Box sx={modalStyle}>
        <Typography
          id="edit-user-title"
          variant="h6"
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          Edit User
        </Typography>

        <form id="edit-user-form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField {...register("name")} label="Full Name" fullWidth />
            <TextField {...register("email")} label="Email Address" fullWidth />

            {isSuperAdmin && (
              <FormControl fullWidth>
                <InputLabel>Assign Role</InputLabel>
                <Select
                  multiple
                  value={selectedRoles}
                  label="Assign Role"
                  onChange={(e) =>
                    setValue("roles", e.target.value as string[])
                  }
                >
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
            )}

            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              sx={{ mt: 1 }}
            >
              <Button onClick={onClose} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {isSuperAdmin ? "Save All Changes" : "Save Profile"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default EditUserModal;
