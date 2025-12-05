import { useQuery } from 'react-query';
import { dashboardService } from '../services/dashboard.service';

export const useDashboard = (year, month) => {
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ['dashboard', year, month],
    () => dashboardService.getDashboardStats(year, month),
    {
      staleTime: 30000,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: yearlyStats,
    isLoading: isLoadingYearly,
  } = useQuery(
    ['dashboard', 'yearly'],
    () => dashboardService.getYearlyStats(),
    {
      staleTime: 60000,
    }
  );

  const {
    data: monthlyStats,
    isLoading: isLoadingMonthly,
  } = useQuery(
    ['dashboard', 'monthly', year],
    () => dashboardService.getMonthlyStats(year),
    {
      enabled: !!year,
      staleTime: 60000,
    }
  );

  const {
    data: abuseTypeStats,
    isLoading: isLoadingAbuseTypes,
  } = useQuery(
    ['dashboard', 'abuse-types'],
    () => dashboardService.getAbuseTypeStats(),
    {
      staleTime: 60000,
    }
  );

  const {
    data: recentCases,
    isLoading: isLoadingRecentCases,
  } = useQuery(
    ['dashboard', 'recent-cases'],
    () => dashboardService.getRecentCases(),
    {
      staleTime: 30000,
    }
  );

  return {
    dashboardData,
    yearlyStats: yearlyStats || [],
    monthlyStats: monthlyStats || [],
    abuseTypeStats: abuseTypeStats || [],
    recentCases: recentCases || [],
    isLoading: isLoading || isLoadingYearly || isLoadingMonthly || isLoadingAbuseTypes || isLoadingRecentCases,
    error,
    refetch,
  };
};