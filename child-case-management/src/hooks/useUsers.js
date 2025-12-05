import { useQuery, useMutation, useQueryClient } from 'react-query';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';

export const useUsers = () => {
  const queryClient = useQueryClient();

  // Fetch users
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery(
    'users',
    () => authService.getUsers(),
    {
      staleTime: 60000,
    }
  );

  // Fetch roles
  const {
    data: roles,
    isLoading: isLoadingRoles,
  } = useQuery(
    'roles',
    () => authService.getRoles(),
    {
      staleTime: 60000,
    }
  );

  // Create user mutation
  const createUserMutation = useMutation(
    (userData) => authService.createUser(userData),
    {
      onSuccess: () => {
        toast.success('User created successfully');
        queryClient.invalidateQueries('users');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create user');
      },
    }
  );

  // Update user mutation
  const updateUserMutation = useMutation(
    ({ id, data }) => authService.updateUser(id, data),
    {
      onSuccess: () => {
        toast.success('User updated successfully');
        queryClient.invalidateQueries('users');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update user');
      },
    }
  );

  // Delete user mutation
  const deleteUserMutation = useMutation(
    (id) => authService.deleteUser(id),
    {
      onSuccess: () => {
        toast.success('User deleted successfully');
        queryClient.invalidateQueries('users');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to delete user');
      },
    }
  );

  return {
    users: users || [],
    roles: roles || [],
    isLoading: isLoading || isLoadingRoles,
    error,
    refetch,
    createUser: createUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    isCreating: createUserMutation.isLoading,
    isUpdating: updateUserMutation.isLoading,
    isDeleting: deleteUserMutation.isLoading,
  };
};