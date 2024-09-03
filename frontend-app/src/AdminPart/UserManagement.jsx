import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchAllUsers, registerUser, updateUser } from '../services/adminService';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState(''); // 'add' or 'edit'
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const usersList = await fetchAllUsers();
            setUsers(usersList);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const handleOpenDialog = (type, user = null) => {
        setDialogType(type);
        if (type === 'edit' && user) {
            setCurrentUser(user);
            setFormData({ username: user.username, email: user.email, password: '' });
        } else {
            setCurrentUser(null);
            setFormData({ username: '', email: '', password: '' });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            if (dialogType === 'add') {
                await registerUser(formData);
            } else if (dialogType === 'edit' && currentUser) {
                await updateUser(currentUser.id, formData);
            }
            fetchUsers();
            handleCloseDialog();
        } catch (error) {
            console.error('Failed to save user', error);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId); // You'll need to implement deleteUser
                fetchUsers();
            } catch (error) {
                console.error('Failed to delete user', error);
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog('add')}>
                Add User
            </Button>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenDialog('edit', user)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(user.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{dialogType === 'add' ? 'Add User' : 'Edit User'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="username"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    {dialogType === 'add' && (
                        <TextField
                            margin="dense"
                            name="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="standard"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit}>
                        {dialogType === 'add' ? 'Add' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserManagement;
