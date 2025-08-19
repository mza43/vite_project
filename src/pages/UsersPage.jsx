import React from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import useUsersPage from "../hooks/useUsersPage";
import UsersToolbar from "../components/users/UsersToolbar";
import UsersTable from "../components/users/UsersTable";
import UserFormDialog from "../components/users/UserFormDialog";
import UserViewDialog from "../components/users/UserViewDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";
import NotificationDialog from "../components/common/NotificationDialog";

export default function UsersPage() {
  const {
    users,
    loading,
    meta,
    searchTerm,
    onSearch,
    page,
    goPrevious,
    goNext,
    onAdd,
    onEdit,
    onView,
    onDelete,
    onSortChanged,
    onFilterChanged,
    openDialog,
    formInitialUser,
    onCloseDialog,
    onSubmitForm,
    openView,
    selectedUser,
    onCloseView, 
    openConfirm,
    onConfirmDelete,
    onCloseConfirm,
    notificationOpen,
    notificationMessage,
    onCloseNotification,
  } = useUsersPage();

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>

      <UsersToolbar searchTerm={searchTerm} onSearch={onSearch} onAdd={onAdd} />

     
      <Box position="relative">
        <UsersTable
          users={users}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onSortChanged={onSortChanged}
          onFilterChanged={onFilterChanged}
        />
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.6)",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>

      {/* Pagination */}
      <Box display="flex" justifyContent="space-between" mt={2}>
        <div>
          Page {meta?.currentPage ?? page} of {meta?.lastPage ?? 1} | Total:{" "}
          {meta?.total ?? 0}
        </div>
        <Box>
          <Button
            variant="outlined"
            onClick={goPrevious}
            disabled={(meta?.currentPage ?? page) === 1}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            onClick={goNext}
            disabled={(meta?.currentPage ?? page) === (meta?.lastPage ?? 1)}
            sx={{ ml: 1 }}
          >
            Next
          </Button>
        </Box>
      </Box>

      {/* Dialogs */}
      <UserFormDialog
        open={openDialog}
        onClose={onCloseDialog}
        initialUser={formInitialUser}
        onSubmit={onSubmitForm}
      />
      <UserViewDialog
        open={openView}
        user={selectedUser}
        onClose={onCloseView} 
      />
      <ConfirmDialog
        open={openConfirm}
        onClose={onCloseConfirm}
        onConfirm={onConfirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user?"
      />
      <NotificationDialog
        open={notificationOpen}
        message={notificationMessage}
        onClose={onCloseNotification}
      />
    </div>
  );
}
