import type { SEOMetadata } from '@/types/seo';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Minus, TrendingUp, TrendingDown } from 'lucide-react';
import { ScoreBadge } from './score-badge';

interface ComparisonTableProps {
  target: SEOMetadata;
  competitors: SEOMetadata[];
}

function CompareValue({ target, competitors, field, isHigherBetter = true }: {
  target: number;
  competitors: number[];
  field: string;
  isHigherBetter?: boolean;
}) {
  const maxCompetitor = Math.max(...competitors);
  const isWin = isHigherBetter ? target > maxCompetitor : target < maxCompetitor;
  const isTie = target === maxCompetitor;

  if (isTie) return <Minus className="w-4 h-4 text-gray-400" />;
  return isWin ? (
    <TrendingUp className="w-4 h-4 text-green-500" />
  ) : (
    <TrendingDown className="w-4 h-4 text-red-500" />
  );
}

export function ComparisonTable({ target, competitors }: ComparisonTableProps) {
  const allSites = [target, ...competitors];

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Metric</TableHead>
            <TableHead className="font-bold">Target Site</TableHead>
            {competitors.map((_, i) => (
              <TableHead key={i}>Competitor {i + 1}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">SEO Score</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ScoreBadge score={target.score} />
              </div>
            </TableCell>
            {competitors.map((comp, i) => (
              <TableCell key={i}>
                <div className="flex items-center gap-2">
                  <ScoreBadge score={comp.score} />
                  <CompareValue
                    target={target.score}
                    competitors={competitors.map(c => c.score)}
                    field="score"
                  />
                </div>
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Title</TableCell>
            <TableCell className={target.title ? 'text-green-600' : 'text-red-600'}>
              {target.title ? (
                <div>
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  <span className="text-xs">{target.title.substring(0, 50)}...</span>
                </div>
              ) : (
                <div><XCircle className="w-4 h-4 inline mr-2" />Missing</div>
              )}
            </TableCell>
            {competitors.map((comp, i) => (
              <TableCell key={i} className={comp.title ? 'text-green-600' : 'text-red-600'}>
                {comp.title ? (
                  <div>
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    <span className="text-xs">{comp.title.substring(0, 50)}...</span>
                  </div>
                ) : (
                  <div><XCircle className="w-4 h-4 inline mr-2" />Missing</div>
                )}
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Description</TableCell>
            <TableCell className={target.description ? 'text-green-600' : 'text-red-600'}>
              {target.description ? (
                <div>
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  <span className="text-xs">{target.description.substring(0, 50)}...</span>
                </div>
              ) : (
                <div><XCircle className="w-4 h-4 inline mr-2" />Missing</div>
              )}
            </TableCell>
            {competitors.map((comp, i) => (
              <TableCell key={i} className={comp.description ? 'text-green-600' : 'text-red-600'}>
                {comp.description ? (
                  <div>
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    <span className="text-xs">{comp.description.substring(0, 50)}...</span>
                  </div>
                ) : (
                  <div><XCircle className="w-4 h-4 inline mr-2" />Missing</div>
                )}
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">H1 Tags</TableCell>
            <TableCell>
              <span className={target.h1.length > 0 ? 'text-green-600' : 'text-red-600'}>
                {target.h1.length > 0 ? <CheckCircle className="w-4 h-4 inline mr-2" /> : <XCircle className="w-4 h-4 inline mr-2" />}
                {target.h1.length}
              </span>
            </TableCell>
            {competitors.map((comp, i) => (
              <TableCell key={i}>
                <span className={comp.h1.length > 0 ? 'text-green-600' : 'text-red-600'}>
                  {comp.h1.length > 0 ? <CheckCircle className="w-4 h-4 inline mr-2" /> : <XCircle className="w-4 h-4 inline mr-2" />}
                  {comp.h1.length}
                </span>
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">H2 Tags</TableCell>
            <TableCell>
              <span className={target.h2.length > 0 ? 'text-green-600' : 'text-red-600'}>
                {target.h2.length}
              </span>
            </TableCell>
            {competitors.map((comp, i) => (
              <TableCell key={i}>
                <span className={comp.h2.length > 0 ? 'text-green-600' : 'text-red-600'}>
                  {comp.h2.length}
                </span>
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Total Headings</TableCell>
            <TableCell>
              {target.h1.length + target.h2.length + target.h3.length}
            </TableCell>
            {competitors.map((comp, i) => (
              <TableCell key={i}>
                {comp.h1.length + comp.h2.length + comp.h3.length}
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Images with Alt</TableCell>
            <TableCell>
              <span className={target.imagesWithoutAlt === 0 ? 'text-green-600' : 'text-red-600'}>
                {target.totalImages - target.imagesWithoutAlt}/{target.totalImages}
              </span>
            </TableCell>
            {competitors.map((comp, i) => (
              <TableCell key={i}>
                <span className={comp.imagesWithoutAlt === 0 ? 'text-green-600' : 'text-red-600'}>
                  {comp.totalImages - comp.imagesWithoutAlt}/{comp.totalImages}
                </span>
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Word Count</TableCell>
            <TableCell>{target.wordCount}</TableCell>
            {competitors.map((comp, i) => (
              <TableCell key={i}>{comp.wordCount}</TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
