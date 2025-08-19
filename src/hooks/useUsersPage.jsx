import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../store/usersSlice";

function useDebounce(value, delay = 400) {
  const [d, setD] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setD(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return d;
}

export default function useUsersPage() {
  const dispatch = useDispatch();
  const {
    list: usersFromStore = [],
    loading,
    meta,
  } = useSelector((s) => s.users || {});

  const [users, setUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [filters, setFilters] = useState({});

  const [page, setPage] = useState(1);
  const [sortModel, setSortModel] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [formInitialUser, setFormInitialUser] = useState(null);
  const [editId, setEditId] = useState(null);

  const [openView, setOpenView] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    if (!loading) {
      setUsers(usersFromStore);
    }
  }, [usersFromStore, loading]);

  useEffect(() => {
    dispatch(
      fetchUsers({
        page,
        limit: 20,
        filters,
        q: debouncedSearch || "",
        sortField: sortModel[0]?.colId || "id",
        sortOrder: sortModel[0]?.sort || "asc",
      })
    );
  }, [dispatch, page, filters, debouncedSearch, sortModel]);

  const onSearch = useCallback((q) => {
    setSearchTerm(q);
    setPage(1);

    setFilters((prev) => {
      const next = { ...prev };
      if (q && q.trim() !== "") next.name = q.trim();
      else delete next.name;
      return next;
    });
  }, []);

  const onFilterChanged = useCallback(
    (newFilters) => {
      setFilters(() => {
        const merged = { ...newFilters };

        if (searchTerm && searchTerm.trim() !== "") {
          merged.name = searchTerm.trim();
        } else {
          if (!merged.name) delete merged.name;
        }

        return merged;
      });
      setPage(1);
    },
    [searchTerm]
  );

  const onSortChanged = useCallback((sort) => {
    setSortModel(sort);
    setPage(1);
  }, []);

  const onAdd = useCallback(() => {
    setFormInitialUser(null);
    setEditId(null);
    setOpenDialog(true);
  }, []);

  const onEdit = useCallback((user) => {
    setFormInitialUser(user || null);
    setEditId(user?.id ?? null);
    setOpenDialog(true);
  }, []);

  const onView = useCallback((user) => {
    setSelectedUser(user);
    setOpenView(true);
  }, []);

  const onDelete = useCallback((id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  }, []);

  const onCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setFormInitialUser(null);
    setEditId(null);
  }, []);

  const onCloseView = useCallback(() => setOpenView(false), []);
  const onCloseConfirm = useCallback(() => setOpenConfirm(false), []);
  const onCloseNotification = useCallback(() => setNotificationOpen(false), []);

  const onSubmitForm = useCallback(
    async (values) => {
      try {
        const payload = {
          name: values.name,
          email: values.email,
          settings: { phone: values.phone, city: values.city },
        };

        if (editId) {
          await dispatch(updateUser({ id: editId, user: payload })).unwrap();
          setNotificationMessage("User updated successfully!");
        } else {
          await dispatch(createUser(payload)).unwrap();
          setNotificationMessage("User created successfully!");
        }

        await dispatch(
          fetchUsers({
            page,
            limit: 20,
            filters,
            q: debouncedSearch || "",
            sortField: sortModel[0]?.colId || "id",
            sortOrder: sortModel[0]?.sort || "asc",
          })
        );

        setNotificationOpen(true);
        setOpenDialog(false);
      } catch (err) {
        setNotificationMessage(err?.message || "Something went wrong!");
        setNotificationOpen(true);
      }
    },
    [dispatch, editId, page, filters, debouncedSearch, sortModel]
  );

  const onConfirmDelete = useCallback(async () => {
    try {
      if (!deleteId) return;
      await dispatch(deleteUser(deleteId)).unwrap();

      await dispatch(
        fetchUsers({
          page,
          limit: 20,
          filters,
          q: debouncedSearch || "",
          sortField: sortModel[0]?.colId || "id",
          sortOrder: sortModel[0]?.sort || "asc",
        })
      );

      setNotificationMessage("User deleted successfully!");
      setNotificationOpen(true);
    } catch (err) {
      setNotificationMessage(err?.message || "Delete failed!");
      setNotificationOpen(true);
    } finally {
      setOpenConfirm(false);
      setDeleteId(null);
    }
  }, [dispatch, deleteId, page, filters, debouncedSearch, sortModel]);

  const goPrevious = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goNext = useCallback(() => setPage((p) => p + 1), []);

  return {
    users,
    loading,
    meta,

    searchTerm,
    onSearch,
    filters,
    onFilterChanged,
    page,
    setPage,
    goPrevious,
    goNext,
    sortModel,
    onSortChanged,

    onAdd,
    onEdit,
    onView,
    onDelete,

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
  };
}
