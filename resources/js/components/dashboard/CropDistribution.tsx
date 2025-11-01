import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CropData {
  crop: string;
  count: number;
  percentage: number;
  [key: string]: string | number;
}

interface CropDistributionProps {
  data: CropData[];
}

const COLORS = ['#1e3a8a', '#000080', '#000080', '#000099', '#0000b3'];

export default function CropDistribution({ data }: CropDistributionProps) {
  return (
    <Card sx={{ boxShadow: 2, height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e3a8a', mb: 3 }}>
          Crop Distribution (Top 5)
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          {data.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', py: 8 }}>
              No crop data available
            </Typography>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ crop, percentage }) => `${crop}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: '0.875rem', fontWeight: 500 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
