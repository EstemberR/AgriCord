import FullLayout from '@/layouts/full/FullLayout';
import { Head } from '@inertiajs/react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface ComplianceScore {
  category: string;
  score: number;
}

interface Props {
  complianceScores: ComplianceScore[];
  summary: {
    overallScore: number;
    auditSuccess: number;
    dataQuality: number;
    completionRate: number;
  };
}

const getScoreColor = (score: number) => {
  if (score >= 90) return '#185c37';
  if (score >= 80) return '#f59e0b';
  return '#dc2626';
};

export default function ComplianceReport({ complianceScores, summary }: Props) {
  const radarData = complianceScores.map(item => ({
    subject: item.category,
    A: item.score,
    fullMark: 100,
  }));
  return (
    <FullLayout>
      <Head title="Compliance Report" />
      
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#1a223f', fontWeight: 700 }}>
            Compliance Report
          </Typography>
          <Button
            variant="contained"
            startIcon={<PdfIcon />}
            sx={{
              bgcolor: '#185c37',
              '&:hover': { bgcolor: '#134c2d' }
            }}
          >
            Export PDF
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 3 }}>
          {/* Summary Cards */}
          <Card sx={{ bgcolor: '#1a223f', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 28, color: '#000080' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Overall Score
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {Math.round(summary.overallScore)}%
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Current compliance
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ bgcolor: '#185c37', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 28, color: '#006400' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Audit Success
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {summary.auditSuccess}%
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Pass rate
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ bgcolor: '#f59e0b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <WarningIcon sx={{ fontSize: 28, color: '#FFA500' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Data Quality
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {summary.dataQuality}%
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Accuracy score
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: '#2563eb', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <ScheduleIcon sx={{ fontSize: 28, color: '#808080' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Completion Rate
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {summary.completionRate}%
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Required fields
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
          {/* Compliance Scores */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Category Scores</Typography>
              <Box sx={{ '& > *:not(:last-child)': { mb: 3 } }}>
                {complianceScores.map((item, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{item.category}</Typography>
                      <Typography variant="body2" sx={{ color: getScoreColor(item.score) }}>
                        {item.score}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.score}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getScoreColor(item.score),
                          borderRadius: 4,
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Compliance Overview</Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Score"
                      dataKey="A"
                      stroke="#185c37"
                      fill="#185c37"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>


      </Box>
    </FullLayout>
  );
}