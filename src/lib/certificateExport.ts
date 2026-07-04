import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { CERTIFICATE_ELEMENT_ID, CERT_CANVAS, CERT_ASSETS } from "@/certificates/CertificateDocument";

const EXPORT_SCALE = 2;

async function preloadImages(): Promise<void> {
  await Promise.all(
    Object.values(CERT_ASSETS).map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        })
    )
  );
}

async function captureCanvas(): Promise<HTMLCanvasElement> {
  const node = document.getElementById(CERTIFICATE_ELEMENT_ID);
  if (!node) throw new Error("Certificate element not found for export");

  await preloadImages();
  await document.fonts.ready;

  return html2canvas(node, {
    scale: EXPORT_SCALE,
    useCORS: true,
    backgroundColor: "#ffffff",
    width: CERT_CANVAS.width,
    height: CERT_CANVAS.height,
  });
}

export function getCertificateElementId(): string {
  return CERTIFICATE_ELEMENT_ID;
}

export async function exportCertificatePng(filename: string): Promise<void> {
  const canvas = await captureCanvas();
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export async function exportCertificatePdf(filename: string): Promise<void> {
  const canvas = await captureCanvas();
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [CERT_CANVAS.width, CERT_CANVAS.height],
  });
  pdf.addImage(imgData, "PNG", 0, 0, CERT_CANVAS.width, CERT_CANVAS.height);
  pdf.save(filename);
}

export function printCertificate(): void {
  window.print();
}
