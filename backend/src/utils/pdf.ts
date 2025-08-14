import PDFDocument from 'pdfkit';

export function buildApplicationPdf(validatedData: any, imagePaths: string[]): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 0,
      size: 'A4',
      bufferPages: true,
    });

    const chunks: Buffer[] = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // THEME
    const backgroundColor = '#1f1f1f'; // body for all pages
    const headerHeight = 120;
    const titleColor = '#fa0';
    const textColor = '#FFFFFF';
    const lineColor = '#4B5563';
    const footerColor = '#9CA3AF';

    // Page painting
    let pageIndex = 0;
    const paintPageChrome = () => {
      // body background on every page
      doc.save()
        .rect(0, 0, doc.page.width, doc.page.height)
        .fill(backgroundColor)
        .restore();

      // Black header ONLY on first page
      if (pageIndex === 0) {
        doc.save()
          .rect(0, 0, doc.page.width, headerHeight)
          .fill('black')
          .restore();

        doc.fillColor(titleColor)
          .font('Helvetica-Bold')
          .fontSize(24)
          .text('MODEL APPLICATION',50, 40, { align: 'left' })
          .fontSize(12)
          .text('Next Peace Nepal',  50, 70);
      }
    };

    // Paint first page before anything else
    paintPageChrome();

    // Repaint on new pages (no black header)
    doc.on('pageAdded', () => {
      pageIndex += 1;
      paintPageChrome();
    });

    // PROFILE AVATAR (circular)
    const profilePic = imagePaths?.[0];
    if (profilePic) {
      try {
        const r = 45;
        const cx = doc.page.width - 100 - 30 + r; // right padding + radius
        const cy = 30 + r;
        doc.save().circle(cx, cy, r).clip();
        doc.image(profilePic, cx - r, cy - r, { cover: [r * 2, r * 2], align: 'center', valign: 'center' });
        doc.restore().circle(cx, cy, r).lineWidth(2).stroke('#ffffff');
      } catch (e) {
        console.warn('Profile image failed to load:', (e as Error).message);
      }
    }

    // CONTENT
    let yPosition = headerHeight + 30; // after header on first page
    const bottomMargin = 60;

    const sectionStyle = {
      titleFont: 'Helvetica-Bold',
      titleSize: 16,
      contentFont: 'Helvetica',
      contentSize: 12,
      marginBottom: 20,
      lineHeight: 20,
    };

    const ensurePageSpace = (needed: number) => {
      if (yPosition + needed > doc.page.height - bottomMargin) {
        doc.addPage();
        yPosition = 50; // top padding on subsequent pages (no header)
      }
    };

    const addSection = (title: string, content: Record<string, string | number | undefined | null>) => {
      ensurePageSpace(40);

      doc.font(sectionStyle.titleFont)
        .fontSize(sectionStyle.titleSize)
        .fillColor(titleColor)
        .text(title, 50, yPosition);

      yPosition += 25;

      doc.font(sectionStyle.contentFont)
        .fontSize(sectionStyle.contentSize)
        .fillColor(textColor);

      Object.entries(content).forEach(([label, raw]) => {
        const value = String(raw ?? 'N/A');
        if (value.trim().length) {
          ensurePageSpace(sectionStyle.lineHeight);
          doc.text(`${label}:`, 50, yPosition, { width: 200, align: 'left' })
             .text(value, 250, yPosition, { width: doc.page.width - 300, align: 'left' });
          yPosition += sectionStyle.lineHeight;
        }
      });

      ensurePageSpace(15);
      doc.moveTo(50, yPosition + 5)
        .lineTo(doc.page.width - 50, yPosition + 5)
        .lineWidth(1)
        .stroke(lineColor);

      yPosition += sectionStyle.marginBottom;
    };

    // SECTIONS
    addSection('PERSONAL INFORMATION', {
      'Full Name': validatedData.name,
      'Mobile Number': validatedData.phone,
      'Email': validatedData.email,
      'Location': `${validatedData.city}, ${validatedData.country}`,
      'Ethnicity': validatedData.ethnicity,
      'Age': validatedData.age,
      'Gender': validatedData.gender,
      'Occupation': validatedData.occupation,
    });

    addSection('PHYSICAL ATTRIBUTES', {
      'Dress Size': validatedData.dressSize,
      'Shoe Size': validatedData.shoeSize,
      'Hair Color': validatedData.hairColor,
      'Eye Color': validatedData.eyeColor,
      'Weight': `${validatedData.weight} kg`,
    });

    addSection('EVENT INFORMATION', {
      'Event': validatedData.event,
      'Audition Place': validatedData.auditionPlace,
    });

    addSection('FAMILY INFORMATION', {
      "Parent's Name": validatedData.parentsName,
      "Parent's Contact": validatedData.parentsMobile,
      "Parent's Occupation": validatedData.parentsOccupation,
    });

    addSection('ADDRESS', {
      'Permanent Address': validatedData.permanentAddress,
      'Temporary Address': validatedData.temporaryAddress,
    });

    addSection('ADDITIONAL INFORMATION', {
      'Talents': validatedData.talents,
      'Hobbies': validatedData.hobbies,
      'How did you hear about us': validatedData.heardFrom,
      'Additional Message': validatedData.additionalMessage,
    });

    // FOOTER (fix widths so right text doesn’t wrap)
    const footerY = doc.page.height - 40;
    doc.fontSize(10).fillColor(footerColor);

    // left text box
    doc.text(
      `Application submitted on: ${new Date().toLocaleDateString()}`,
      50,
      footerY,
      { width: doc.page.width / 2 - 60, align: 'left' }
    );

    // right text box
    doc.text(
      '© Next Peace Nepal',
      doc.page.width / 2,
      footerY,
      { width: doc.page.width / 2 - 50, align: 'right' }
    );

    doc.end();
  });
}
