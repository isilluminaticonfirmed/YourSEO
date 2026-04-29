'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileDown, Building2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { SEOMetadata } from '@/types/seo';

interface PDFExportModalProps {
  target: SEOMetadata;
  competitors: SEOMetadata[];
}

export function PDFExportModal({ target, competitors }: PDFExportModalProps) {
  const [open, setOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Header with company name
      if (companyName) {
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text(companyName, pageWidth / 2, 20, { align: 'center' });
      }

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SEO Competitor Analysis Report', pageWidth / 2, companyName ? 30 : 20, { align: 'center' });

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, companyName ? 36 : 26, { align: 'center' });

      // Target site info
      let yPos = companyName ? 50 : 40;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Target Site: ' + new URL(target.url).hostname, 20, yPos);
      yPos += 10;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`SEO Score: ${target.score}/100`, 20, yPos);
      yPos += 6;
      pdf.text(`Title: ${target.title.substring(0, 80)}`, 20, yPos);
      yPos += 6;
      pdf.text(`Description: ${target.description.substring(0, 80)}`, 20, yPos);
      yPos += 6;
      pdf.text(`Word Count: ${target.wordCount}`, 20, yPos);
      yPos += 6;
      pdf.text(`Total Headings: ${target.h1.length + target.h2.length + target.h3.length}`, 20, yPos);
      yPos += 6;
      const altPercent = target.totalImages > 0 ? Math.round(((target.totalImages - target.imagesWithoutAlt) / target.totalImages) * 100) : 100;
      pdf.text(`Images with Alt: ${altPercent}%`, 20, yPos);
      yPos += 10;

      // Competitors comparison
      competitors.forEach((comp, idx) => {
        if (yPos > pageHeight - 60) {
          pdf.addPage();
          yPos = 20;
        }

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Competitor ${idx + 1}: ${new URL(comp.url).hostname}`, 20, yPos);
        yPos += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`SEO Score: ${comp.score}/100`, 25, yPos);
        yPos += 5;
        pdf.text(`Word Count: ${comp.wordCount}`, 25, yPos);
        yPos += 5;
        pdf.text(`Total Headings: ${comp.h1.length + comp.h2.length + comp.h3.length}`, 25, yPos);
        yPos += 5;
        const compAltPercent = comp.totalImages > 0 ? Math.round(((comp.totalImages - comp.imagesWithoutAlt) / comp.totalImages) * 100) : 100;
        pdf.text(`Images with Alt: ${compAltPercent}%`, 25, yPos);
        yPos += 10;
      });

      // Footer on each page
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Powered by SEO Competitor Analyzer`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        if (companyName) {
          pdf.text(companyName, pageWidth / 2, pageHeight - 5, { align: 'center' });
        }
      }

      pdf.save(`seo-report-${companyName ? companyName.replace(/\s+/g, '-').toLowerCase() : 'branded'}.pdf`);
      setOpen(false);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" className="gap-2">
          <FileDown className="w-4 h-4" />
          Download Branded Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Brand Your Report
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Enter Company Name for Report Header
            </label>
            <Input
              placeholder="Acme SEO Agency"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full"
          >
            <FileDown className="w-4 h-4 mr-2" />
            {isExporting ? 'Generating PDF...' : 'Export PDF'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
