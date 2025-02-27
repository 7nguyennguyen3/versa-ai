import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib"; // Install with `npm install pdf-lib`

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Invalid PDF file" }, { status: 400 });
    }

    // Read file buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const originalSizeMB = fileBuffer.length / (1024 * 1024); // Convert bytes to MB

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(fileBuffer);

    // Remove metadata (reduces unnecessary data)
    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer("");
    pdfDoc.setCreator("");

    // Rewriting the document (this helps remove unnecessary data)
    const optimizedPdfBytes = await pdfDoc.save();
    const optimizedSizeMB = optimizedPdfBytes.length / (1024 * 1024);
    const mbOptimized = originalSizeMB - optimizedSizeMB;

    // Return optimized PDF
    return new NextResponse(optimizedPdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="optimized.pdf"',
        "X-Original-Size-MB": originalSizeMB.toFixed(2),
        "X-Optimized-Size-MB": optimizedSizeMB.toFixed(2),
        "X-MB-Optimized": mbOptimized.toFixed(2),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "PDF optimization failed", details: error.message },
      { status: 500 }
    );
  }
}
