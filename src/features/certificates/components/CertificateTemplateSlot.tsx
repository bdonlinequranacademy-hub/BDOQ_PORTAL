import { useEffect, useRef, useState } from "react";
import type { CertificateView } from "@/types/models";
import { CertificateDocument, CERT_CANVAS } from "@/certificates/CertificateDocument";

interface ICertificateTemplateSlotProps {
  certificate: CertificateView;
}

export function CertificateTemplateSlot({ certificate }: ICertificateTemplateSlotProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const update = () => {
      const available = el.clientWidth;
      setScale(Math.min(1, available / CERT_CANVAS.width));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="certificate-preview-wrap w-full overflow-x-auto rounded-xl border border-portal bg-zinc-100/80 p-4 dark:bg-zinc-900/50">
      <div ref={wrapRef} className="certificate-preview-scaler mx-auto w-full">
        <div
          style={{
            width: CERT_CANVAS.width * scale,
            height: CERT_CANVAS.height * scale,
          }}
        >
          <div
            style={{
              width: CERT_CANVAS.width,
              height: CERT_CANVAS.height,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <CertificateDocument certificate={certificate} />
          </div>
        </div>
      </div>
    </div>
  );
}
