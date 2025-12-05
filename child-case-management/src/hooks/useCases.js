import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { caseService } from '../services/case.service';
import toast from 'react-hot-toast';

export const useCases = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({});

  // Fetch cases with filters
  const {
    data: cases,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ['cases', filters],
    () => caseService.getCases(filters),
    {
      keepPreviousData: true,
      staleTime: 60000,
    }
  );

  // Fetch case by ID
  const useCase = (caseId) => {
    return useQuery(
      ['case', caseId],
      () => caseService.getCaseById(caseId),
      {
        enabled: !!caseId,
        staleTime: 60000,
      }
    );
  };

  // Register new case mutation
  const registerCaseMutation = useMutation(
    (caseData) => caseService.registerCase(caseData),
    {
      onSuccess: () => {
        toast.success('Case registered successfully');
        queryClient.invalidateQueries(['cases']);
        queryClient.invalidateQueries(['dashboard']);
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to register case');
      },
    }
  );

  // Update case mutation
  const updateCaseMutation = useMutation(
    ({ id, data }) => caseService.updateCase(id, data),
    {
      onSuccess: (_, variables) => {
        toast.success('Case updated successfully');
        queryClient.invalidateQueries(['case', variables.id]);
        queryClient.invalidateQueries(['cases']);
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update case');
      },
    }
  );

  // Delete case mutation
  const deleteCaseMutation = useMutation(
    (id) => caseService.deleteCase(id),
    {
      onSuccess: () => {
        toast.success('Case deleted successfully');
        queryClient.invalidateQueries(['cases']);
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to delete case');
      },
    }
  );

  // Assign case mutation
  const assignCaseMutation = useMutation(
    ({ caseId, focalPersonId }) => caseService.assignCase(caseId, focalPersonId),
    {
      onSuccess: (_, variables) => {
        toast.success('Case assigned successfully');
        queryClient.invalidateQueries(['case', variables.caseId]);
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to assign case');
      },
    }
  );

  // Update case status mutation
  const updateCaseStatusMutation = useMutation(
    ({ caseId, status }) => caseService.updateCaseStatus(caseId, status),
    {
      onSuccess: (_, variables) => {
        toast.success('Case status updated successfully');
        queryClient.invalidateQueries(['case', variables.caseId]);
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update case status');
      },
    }
  );

  // Search cases
  const searchCases = useCallback(async (searchParams) => {
    try {
      return await caseService.searchCases(searchParams);
    } catch (error) {
      toast.error(error.message || 'Search failed');
      throw error;
    }
  }, []);

  // Get case statistics
  const getCaseStats = useCallback(async () => {
    try {
      return await caseService.getCaseStats();
    } catch (error) {
      console.error('Failed to fetch case stats:', error);
      return null;
    }
  }, []);

  return {
    cases: cases?.data || [],
    pagination: cases?.pagination,
    isLoading,
    error,
    filters,
    setFilters,
    refetch,
    useCase,
    registerCase: registerCaseMutation.mutateAsync,
    updateCase: updateCaseMutation.mutateAsync,
    deleteCase: deleteCaseMutation.mutateAsync,
    assignCase: assignCaseMutation.mutateAsync,
    updateCaseStatus: updateCaseStatusMutation.mutateAsync,
    searchCases,
    getCaseStats,
    isRegistering: registerCaseMutation.isLoading,
    isUpdating: updateCaseMutation.isLoading,
    isDeleting: deleteCaseMutation.isLoading,
  };
};