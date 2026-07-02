'use client'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Invoice, BusinessSettings, currencySymbol } from './types'

function hexToRgb(hex: string): [number,number,number] {
  const c = hex.replace('#','')
  return [parseInt(c.slice(0,2),16), parseInt(c.slice(2,4),16), parseInt(c.slice(4,6),16)]
}

function getFormat(dataUrl: string): string {
  if (dataUrl.includes('image/png')) return 'PNG'
  if (dataUrl.includes('image/jpg') || dataUrl.includes('image/jpeg')) return 'JPEG'
  if (dataUrl.includes('image/webp')) return 'WEBP'
  return 'PNG'
}

async function toDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { mode: 'cors' })
    const blob = await res.blob()
    return new Promise(resolve => {
      const r = new FileReader()
      r.onload = e => resolve(e.target?.result as string)
      r.onerror = () => resolve(null)
      r.readAsDataURL(blob)
    })
  } catch { return null }
}

function addImageFit(doc: jsPDF, data: string, x: number, y: number, maxW: number, maxH: number) {
  try {
    const fmt = getFormat(data)
    // Create temp image to get dimensions
    const img = new Image()
    img.src = data
    const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 2
    let w = maxW, h = maxW / ratio
    if (h > maxH) { h = maxH; w = maxH * ratio }
    doc.addImage(data, fmt, x, y, w, h)
    return h
  } catch { return 0 }
}

export async function generatePDF(invoice: Invoice, biz: BusinessSettings | null, printStatus = false): Promise<void> {
  const doc = new jsPDF()
  const isQuote = invoice.type === 'quotation'
  const sym = currencySymbol(invoice.currency || 'GBP')
  const accent: [number,number,number] = hexToRgb(biz?.invoice_color || '#2563eb')
  const dark: [number,number,number] = [17,24,39]
  const gray: [number,number,number] = [107,114,128]
  const light: [number,number,number] = [249,250,251]
  const borderC: [number,number,number] = [229,231,235]
  const white: [number,number,number] = [255,255,255]

  doc.setFillColor(255,255,255); doc.rect(0,0,210,297,'F')
  doc.setFillColor(...accent); doc.rect(0,0,210,2,'F')

  // Load logo + signature in parallel
  const [logoData, sigData] = await Promise.all([
    biz?.logo_url ? toDataUrl(biz.logo_url) : Promise.resolve(null),
    biz?.signature_url ? toDataUrl(biz.signature_url) : Promise.resolve(null),
  ])

  // Logo top-left
  let headerH = 20
  if (logoData) {
    const h = addImageFit(doc, logoData, 14, 6, 50, 20)
    if (h > 0) {
      doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.setTextColor(17,24,39)
      doc.text(biz?.name || 'Sypho CRM', 14, 6 + h + 6)
      headerH = 6 + h + 10
    } else { headerH = 20 }
  } else {
    doc.setTextColor(...dark); doc.setFontSize(18); doc.setFont('helvetica','bold')
    doc.text(biz?.name || 'Sypho CRM', 14, 18)
    headerH = 20
  }

  // Company reg + VAT
  doc.setFontSize(7.5); doc.setFont('helvetica','normal'); doc.setTextColor(...gray)
  let leftY = headerH + 4
  if (biz?.company_reg) { doc.text(`Company No: ${biz.company_reg}`, 14, leftY); leftY += 4.5 }
  if (biz?.vat_number) { doc.text(`VAT No: ${biz.vat_number}`, 14, leftY) }

  // Doc type right
  doc.setTextColor(...accent); doc.setFontSize(22); doc.setFont('helvetica','bold')
  doc.text(isQuote ? 'QUOTATION' : 'INVOICE', 196, 16, { align:'right' })
  doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(...gray)
  doc.text(`#${invoice.invoice_number}`, 196, 23, { align:'right' })
  doc.text(`Date: ${new Date(invoice.issue_date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}`, 196, 29, { align:'right' })
  if (invoice.due_date && !isQuote) doc.text(`Due: ${new Date(invoice.due_date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}`, 196, 35, { align:'right' })

  const divY = Math.max(leftY + 4, 44)
  doc.setDrawColor(...borderC); doc.setLineWidth(0.3); doc.line(14, divY, 196, divY)

  // Bill to
  const cust = invoice.customer
  const billY = divY + 6
  doc.setFontSize(7.5); doc.setFont('helvetica','bold'); doc.setTextColor(...gray)
  doc.text('BILL TO', 14, billY)
  doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.setTextColor(...dark)
  const billName = cust?.type === 'company' ? (cust.company_name || cust.name) : cust?.name || 'Customer'
  doc.text(billName, 14, billY+7)
  doc.setFontSize(8.5); doc.setFont('helvetica','normal'); doc.setTextColor(...gray)
  let cy = billY + 13
  if (cust?.type==='company' && cust.contact_name) { doc.text(`Attn: ${cust.contact_name}`,14,cy); cy+=5 }
  if (cust?.type==='company' && cust.vat_number) { doc.text(`VAT: ${cust.vat_number}`,14,cy); cy+=5 }
  if (cust?.phone) { doc.text(cust.phone,14,cy); cy+=5 }
  if (cust?.address) { doc.text(cust.address,14,cy); cy+=5 }
  if (cust?.city||cust?.postcode) doc.text([cust?.city,cust?.postcode].filter(Boolean).join(', '),14,cy)

  // Status badge
  if (printStatus) {
    const sc: Record<string,[number,number,number]> = { paid:[5,150,105], sent:[37,99,235], draft:[156,163,175], accepted:[5,150,105], declined:[220,38,38] }
    doc.setFillColor(...(sc[invoice.status]||sc.draft))
    doc.roundedRect(148, billY, 44, 12, 3, 3, 'F')
    doc.setTextColor(...white); doc.setFontSize(8); doc.setFont('helvetica','bold')
    doc.text(invoice.status.toUpperCase(), 170, billY+8, { align:'center' })
  }

  // Items table
  const tableY = Math.max(cy+8, divY+42)
  autoTable(doc, {
    startY: tableY,
    head: [['Description','Qty','Unit Price','VAT %','Amount']],
    body: (invoice.items||[]).map(i=>[
      i.description,
      String(i.quantity),
      `${sym}${i.unit_price.toFixed(2)}`,
      `${(i.vat_rate||0)}%`,
      `${sym}${(i.quantity*i.unit_price*(1+(i.vat_rate||0)/100)).toFixed(2)}`,
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: accent, textColor: white, fontStyle: 'bold', fontSize: 8,
      cellPadding: { top: 5, bottom: 5, left: 6, right: 6 },
    },
    bodyStyles: {
      fontSize: 9, cellPadding: { top: 4, bottom: 4, left: 6, right: 6 },
      textColor: dark, lineColor: borderC, lineWidth: 0.2,
    },
    alternateRowStyles: { fillColor: [248, 249, 251] },
    columnStyles: {
      0: { cellWidth: 72 },
      1: { halign: 'center', cellWidth: 22 },
      2: { halign: 'right', cellWidth: 30 },
      3: { halign: 'center', cellWidth: 22 },
      4: { halign: 'right', cellWidth: 30, fontStyle: 'bold', textColor: accent },
    },
    margin: { left: 14, right: 14 },
  })

  const fy = (doc as any).lastAutoTable.finalY

  // Totals
  const tbx=120, tby=fy+14, tbw=76
  doc.setFillColor(...light); doc.roundedRect(tbx,tby,tbw,invoice.vat_amount>0?30:20,4,4,'F')
  doc.setFontSize(8.5); doc.setFont('helvetica','normal'); doc.setTextColor(...gray)
  doc.text('Subtotal',tbx+6,tby+9); doc.setTextColor(...dark)
  doc.text(`${sym}${invoice.subtotal.toFixed(2)}`,tbx+tbw-6,tby+9,{align:'right'})
  if (invoice.vat_amount>0) {
    doc.setTextColor(...gray); doc.text('VAT',tbx+6,tby+17)
    doc.setTextColor(...dark); doc.text(`${sym}${invoice.vat_amount.toFixed(2)}`,tbx+tbw-6,tby+17,{align:'right'})
  }
  const totalY = invoice.vat_amount>0 ? tby+34 : tby+24
  doc.setFillColor(...accent); doc.roundedRect(tbx,totalY,tbw,14,4,4,'F')
  doc.setTextColor(...white); doc.setFontSize(9); doc.setFont('helvetica','bold')
  doc.text('TOTAL',tbx+6,totalY+9)
  doc.text(`${sym}${invoice.total.toFixed(2)}`,tbx+tbw-6,totalY+9,{align:'right'})

  // Notes left side
  let noteY = fy+14
  if (invoice.payment_terms) {
    doc.setFontSize(8); doc.setFont('helvetica','bold'); doc.setTextColor(...gray)
    doc.text('PAYMENT TERMS',14,noteY+5)
    doc.setFont('helvetica','normal'); doc.setTextColor(...dark)
    doc.text(invoice.payment_terms,14,noteY+11); noteY+=20
  }
  if (invoice.notes) {
    doc.setFontSize(8); doc.setFont('helvetica','bold'); doc.setTextColor(...gray)
    doc.text('NOTES',14,noteY+5)
    doc.setFont('helvetica','normal'); doc.setTextColor(...dark)
    const lines = doc.splitTextToSize(invoice.notes,95)
    doc.text(lines,14,noteY+11); noteY+=11+lines.length*5
  }

  // Signature — printed in colour
  if (sigData) {
    const sigY = Math.max(noteY+10, totalY+22)
    const h = addImageFit(doc, sigData, 14, sigY, 55, 22)
    if (h > 0) {
      doc.setFontSize(7.5); doc.setFont('helvetica','normal'); doc.setTextColor(...gray)
      doc.text('Authorised Signature', 14, sigY+h+5)
    }
  }

  // Footer
  const ph = doc.internal.pageSize.height
  doc.setFillColor(...light); doc.rect(0,ph-20,210,20,'F')
  doc.setDrawColor(...borderC); doc.setLineWidth(0.3); doc.line(0,ph-20,210,ph-20)

  const parts: string[] = []
  if (biz?.phone) parts.push(`Tel: ${biz.phone}`)
  if (biz?.email) parts.push(`Email: ${biz.email}`)
  if (biz?.website) parts.push(`Web: ${biz.website}`)
  if (biz?.address) parts.push([biz.address, biz.city, biz.postcode].filter(Boolean).join(', '))

  doc.setFontSize(7.5); doc.setFont('helvetica','normal'); doc.setTextColor(...gray)
  if (parts.length === 0) {
    doc.text(`${biz?.name||'Sypho CRM'}   |   Thank you for your business`, 105, ph-8, {align:'center'})
  } else if (parts.length <= 3) {
    doc.text(parts.join('   |   '), 105, ph-8, {align:'center'})
  } else {
    doc.text(parts.slice(0,3).join('   |   '), 105, ph-13, {align:'center'})
    doc.text(parts.slice(3).join('   |   '), 105, ph-6, {align:'center'})
  }

  doc.save(`${isQuote?'quotation':'invoice'}-${invoice.invoice_number}.pdf`)
}
