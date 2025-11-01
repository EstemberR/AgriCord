import { Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendData {
  month: string;
  count: number;
}

interface RegistrationTrendProps {
  data: TrendData[];
}

export default function RegistrationTrend({ data }: RegistrationTrendProps) {
  return (
    <Card sx={{ boxShadow: 2, height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e3a8a', mb: 3 }}>
          Registration Trend (Last 6 Months)
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                style={{ fontSize: '0.875rem', fontWeight: 500 }}
              />
              <YAxis 
                stroke="#64748b"
                style={{ fontSize: '0.875rem', fontWeight: 500 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
                labelStyle={{ color: '#0f172a', fontWeight: 600 }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#1e3a8a"
                strokeWidth={3}
                dot={{ fill: '#1e3a8a', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7 }}
                name="Registrations"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
