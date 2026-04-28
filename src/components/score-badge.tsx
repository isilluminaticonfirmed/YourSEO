import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ScoreBadgeProps {
  score: number;
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const getColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-3 h-3" />;
    if (score >= 60) return <AlertCircle className="w-3 h-3" />;
    return <XCircle className="w-3 h-3" />;
  };

  return (
    <Badge className={`${getColor(score)} text-white flex items-center gap-1`}>
      {getIcon(score)}
      {score}/100
    </Badge>
  );
}
