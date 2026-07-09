/**
 * CERTIFICATE — শুধু background (Clear_bg.png)
 * Element যোগ করতে নিচের div-এর ভিতরে লিখুন
 */
import { QRCodeSVG } from "qrcode.react";
import {
  FaCertificate,
  FaRegCalendarAlt,
  FaRegClock,
  FaMedal,
  FaRegIdCard,
} from "react-icons/fa";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import type { CertificateView } from "@/types/models";
import {
  formatCertificateCourseLine,
  formatCertificateDate,
  formatVerifyUrlLabel,
} from "@/lib/certificateFormat";

export const CERTIFICATE_ELEMENT_ID = "boq-certificate-document";
export const CERT_CANVAS = { width: 1492, height: 1054 };

export const CERT_ASSETS = {
  background: "/certificates/Clear_bg.png",
  logo: "/certificates/logo_after_BGRemove.png?v=4",
  shahadahText: "/certificates/shahadah_text_RemoveBG.png",
  completionArt: "/certificates/akmil_text_afterBGRemove.png",
  courseTextBg: "/certificates/course_text_bg(without text).png",
  seal: "/certificates/seal_afterBGRemove.png",
  founderSig: "/certificates/founder_sig_afterBGRemove.png",
  adminSig: "/certificates/admin_sig_afterBGRemove.png",
  levelBadge: "/certificates/level_badge.png",
};

export function CertificateDocument({ certificate }: { certificate: CertificateView }) {
  return (
    <div
      id={CERTIFICATE_ELEMENT_ID}
      className="certificate-document p-10 relative h-[1054px] w-[1492px] overflow-hidden bg-[url('/certificates/Clear_bg.png')] bg-[length:1492px_1054px] bg-no-repeat"
    >
      <div className="flex w-full items-start">
        <div className="relative w-1/5 shrink-0">
          <img
            src={CERT_ASSETS.logo}
            alt="BDOQ Academy logo"
            className="h-[290px] w-auto object-contain"
          />

          <div className="absolute left-9 top-[188px] flex items-center gap-1.5">
            <TfiLayoutLineSolid size={24} className="text-[#EBC071]" />
            <h1 className="text-base font-bold text-black">Since 2019</h1>
            <TfiLayoutLineSolid size={24} className="text-[#EBC071]" />
          </div>
        </div>

        <div className="w-3/4 min-w-0 ml-20">
          <div className="-mt-6 w-[750px] flex justify-center">
            <img
              className="h-[135px] w-auto object-contain"
              src="/certificates/bis_afterBGRemove.png"
              alt="bismillah"
            />
          </div>

          <div className="-mt-10 flex w-[750px] flex-col items-center gap-3">
            {/* group: academy name + taglines */}
            <div className="flex flex-col items-center gap-1">
              <h1 className="font-['Cinzel',serif] text-[48px] font-bold uppercase leading-none text-[#A74B47]">
                BDOQ
              </h1>
              <h1 className="font-['Cinzel',serif] text-[48px] font-bold uppercase leading-none text-[#3C835D]">
                ACADEMY
              </h1>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="h-px w-6 bg-[#EBC071]" />
                  <span className="text-[10px] text-[#EBC071]">◆</span>
                  <span className="h-px w-3 bg-[#EBC071]" />
                </div>
                <p className="text-xs font-semibold text-[#000]">
                  Connecting Hearts to Pure Quran and True Deen, Worldwide
                </p>
                <div className="flex items-center gap-1">
                  <span className="h-px w-3 bg-[#EBC071]" />
                  <span className="text-[10px] text-[#EBC071]">◆</span>
                  <span className="h-px w-6 bg-[#EBC071]" />
                </div>
              </div>

              <p className="text-center font-['Noto_Sans_Bengali',sans-serif] text-sm font-semibold leading-none text-[#000]">
                কুরআনের আলোয় আলোকিত হোক প্রতিটি হৃদয়, বিশ্বজুড়ে
              </p>
            </div>

            {/* group: certificate title art (উপরে-নিচের স্বচ্ছ অংশ crop) */}
            <div className="relative flex h-[172px] w-full max-w-[520px] items-center justify-center overflow-hidden">
              <img
                src="/certificates/shahadah_text_RemoveBG.png"
                alt="شَهَادَةُ إِنْجَاز — Certificate of Achievement — সাফল্য ও সম্মাননা সনদ"
                className="w-full object-contain"
              />
            </div>

            {/* group: intro to name */}
            <div className="flex flex-col items-center gap-0.5">
              <p className="text-center font-['Cinzel',serif] text-xs font-semibold leading-none text-black">
                This is to proudly certify that
              </p>
              <p className="text-center font-['Noto_Sans_Bengali',sans-serif] text-sm font-semibold leading-none text-black">
                এতদ্বারা গর্বের সাথে প্রত্যয়ন করা হচ্ছে যে
              </p>
            </div>

            {/* group: dynamic নাম + akmil arabic (নিচের স্বচ্ছ অংশ crop) */}
            <div className="relative h-[112px] w-full max-w-[440px] overflow-hidden">
              <img
                src={CERT_ASSETS.completionArt}
                alt="أَكْمَلَ بِنَجَاحٍ وَتَمَيُّزٍ"
                className="absolute inset-x-0 top-0 w-full object-contain"
              />
              <p className="cert-font-script absolute inset-x-0 top-[10px] text-center text-[50px] leading-none text-[#3C835D]">
                {certificate.studentName}
              </p>
            </div>

            {/* group: completion line */}
            <div className="flex flex-col items-center gap-0.5">
              <p className="text-center font-['Cinzel',serif] text-base font-semibold leading-none text-black">
                has successfully completed
              </p>
              <p className="text-center font-['Noto_Sans_Bengali',sans-serif] text-sm font-semibold leading-none text-black">
                সফলতারে সাথে সম্পন্ন করেছেন
              </p>
            </div>

            {/* group: course text bg — এর উপর dynamic কোর্সের নাম overlay */}
            <div className="relative flex h-[60px] w-full max-w-[600px] items-center justify-center overflow-hidden">
              <img
                src={CERT_ASSETS.courseTextBg}
                alt=""
                aria-hidden
                className="w-full object-contain"
              />
              <p className="absolute inset-0 mx-auto flex max-w-[360px] items-center justify-center whitespace-nowrap text-center font-['Noto_Sans_Bengali',sans-serif] text-sm font-semibold leading-none text-white">
                {formatCertificateCourseLine(
                  certificate.courseName,
                  certificate.courseNameBn
                )}
              </p>
            </div>

            {/* group: performance text */}
            <div className="flex flex-col items-center gap-0.5">
              <p className="max-w-[560px] text-center font-['Cinzel',serif] text-sm font-semibold leading-tight text-black">
                {certificate.performanceTextEn}
              </p>
              <p className="max-w-[560px] text-center font-['Noto_Sans_Bengali',sans-serif] text-sm font-semibold leading-tight text-black">
                {certificate.performanceTextBn}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* excellent performance badge — বাম পাশে (শুধু showExcellentBadge true হলে) */}
      {certificate.showExcellentBadge && (
        <img
          src={CERT_ASSETS.levelBadge}
          alt="Excellent performance badge"
          className="absolute left-[70px] top-[350px] h-[280px] w-auto object-contain"
        />
      )}

      {/* info panel — ডান পাশে (dynamic value সহ) */}
      <div className="absolute right-[50px] top-[355px] flex w-[360px] flex-col gap-2.5 rounded-xl border border-[#D4A853] bg-white/25 px-5 py-4 shadow-[0_0_0_3px_rgba(212,168,83,0.18)]">
        {[
          {
            icon: <FaCertificate size={16} />,
            en: "Certificate ID",
            bn: "সনদ নং",
            value: certificate.certificateId,
          },
          {
            icon: <FaRegCalendarAlt size={16} />,
            en: "Issue Date",
            bn: "ইস্যু তারিখ",
            value: formatCertificateDate(certificate.issueDate),
          },
          {
            icon: <FaRegClock size={16} />,
            en: "Course Duration",
            bn: "কোর্সের মেয়াদ",
            value: certificate.courseDuration,
          },
          {
            icon: <FaMedal size={16} />,
            en: "Result / Grade",
            bn: "ফলাফল / গ্রেড",
            value: certificate.grade,
          },
          {
            icon: <FaRegIdCard size={16} />,
            en: "Student ID",
            bn: "ছাত্র আইডি",
            value: certificate.studentPortalId,
          },
        ].map((row) => (
          <div key={row.en} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3C835D]/10 text-[#3C835D] ring-1 ring-[#D4A853]/50">
              {row.icon}
            </div>
            <div className="w-[116px] shrink-0">
              <p className="font-['Cinzel',serif] text-[12px] font-semibold uppercase leading-tight tracking-wide text-[#269B6F]">
                {row.en}
              </p>
              <p className="font-['Noto_Sans_Bengali',sans-serif] text-[10px] font-medium leading-tight text-[#6B7280]">
                {row.bn}
              </p>
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <span className="text-sm font-semibold text-[#6B7280]">:</span>
              <span className="min-w-0 flex-1 truncate font-['Cinzel',serif] text-sm font-semibold text-[#1A1A2E]">
                {row.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* QR verify — ডান পাশে (panel-এর সাথে left-aligned) */}
      <div className="absolute right-[50px] top-[705px] flex w-[360px] items-center gap-3">
        <div className="rounded-lg border border-[#EBC071] bg-white p-1.5">
          <QRCodeSVG
            value={certificate.verifyUrl}
            size={84}
            bgColor="#FFFFFF"
            fgColor="#269B6F"
            level="M"
            marginSize={0}
          />
        </div>
        <div className="flex flex-col">
          <p className="font-['Cinzel',serif] text-sm font-bold leading-tight text-[#269B6F]">
            Scan to Verify
          </p>
          <p className="font-['Noto_Sans_Bengali',sans-serif] text-xs font-semibold leading-tight text-black">
            সত্যতা যাচাই করুন
          </p>
          <p className="mt-1 text-[10px] font-medium leading-tight text-[#6B7280]">
            {formatVerifyUrlLabel(certificate.verifyUrl)}
          </p>
        </div>
      </div>

      {/* seal — নিচে মাঝখানে (footer-এর উপরে, দুই স্বাক্ষরের মাঝে) */}
      <img
        src={CERT_ASSETS.seal}
        alt="BDOQ Academy official seal"
        className="absolute bottom-[72px] left-1/2 h-[120px] w-auto -translate-x-1/2 object-contain"
      />

      {/* founder signature — নিচে বাম দিকে */}
      <div className="absolute bottom-[95px] left-[150px] flex w-[320px] flex-col items-center">
        <img
          src={CERT_ASSETS.founderSig}
          alt="Signature of Hafez Mawlana Mufti Abdul Mumin Khan"
          className="h-[115px] w-auto object-contain"
        />
        <div className="mt-1 h-px w-full bg-[#269B6F]/50" />
        <p className="mt-1 text-center font-['Cinzel',serif] text-sm font-bold leading-tight text-[#269B6F]">
          Hafez Mawlana Mufti Abdul Mumin Khan
        </p>
        <p className="text-center font-['Cinzel',serif] text-xs font-semibold leading-tight text-black">
          Founder &amp; Director
        </p>
        <p className="text-center font-['Cinzel',serif] text-xs font-semibold leading-tight text-black">
          BDOQ Academy
        </p>
      </div>

      {/* admin signature — নিচে ডান দিকে */}
      <div className="absolute bottom-[95px] right-[150px] flex w-[320px] flex-col items-center">
        <img
          src={CERT_ASSETS.adminSig}
          alt="Authorized signature"
          className="h-[115px] w-auto object-contain"
        />
        <div className="mt-1 h-px w-full bg-[#269B6F]/50" />
        <p className="mt-1 text-center font-['Cinzel',serif] text-sm font-bold leading-tight text-[#269B6F]">
          Admin Authority
        </p>
        <p className="text-center font-['Cinzel',serif] text-xs font-semibold leading-tight text-black">
          Authorized Signature
        </p>
      </div>
    </div>
  );
}
