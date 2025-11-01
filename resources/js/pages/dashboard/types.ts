export interface DashboardData {
  totalFarmers: number;
  activeFarmers: number;
  totalDistributions: number;
  totalInventoryValue: number;
  lowStockItems: number;
  pendingDistributions: number;
  totalFarmLandArea: number;
  topCrops: Array<{
    name: string;
    count: number;
  }>;
  monthlyDistributions: Array<{
    month: string;
    count: number;
  }>;
  barangayDistribution: Array<{
    barangay: string;
    farmers: number;
  }>;
  fertilizerUsage: Array<{
    type: string;
    usage: number;
  }>;
  recentActivities: Array<{
    id: number;
    description: string;
    user: string;
    timestamp: string;
  }>;
}