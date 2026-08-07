"use client";

import { useState } from "react";
import { Check, Download, Share2, X } from "lucide-react";
import useInstallPrompt from "./useInstallPrompt";

export default function InstallPrompt() {
  const { canInstall, isIosSafari, promptInstall, dismiss } = useInstallPrompt();
  const [showIosGuide, setShowIosGuide] = useState(false);
  if (!canInstall) return null;

  const install = async () => {
    const result = await promptInstall();
    if (result === "ios") setShowIosGuide(true);
  };

  return <>
    <div className="install-banner" role="region" aria-label="تثبيت تطبيق نوفا ماركت">
      <div className="install-banner-copy"><span className="install-banner-icon"><Download size={17} /></span><span><b>ثبّت التطبيق</b><small>{isIosSafari ? "أضف نوفا ماركت إلى شاشتك الرئيسية" : "وصول أسرع وتجربة مستقلة"}</small></span></div>
      <div className="install-banner-actions"><button className="install-btn" onClick={install}>ثبّت التطبيق</button><button className="install-dismiss" onClick={dismiss} aria-label="إخفاء رسالة التثبيت"><X size={16} /></button></div>
    </div>
    {showIosGuide && <div className="customer-overlay" role="dialog" aria-modal="true" aria-label="إضافة نوفا ماركت إلى الشاشة الرئيسية"><div className="customer-modal install-guide"><div className="customer-modal-head"><div><span className="eyebrow">تثبيت سريع</span><h2>أضف إلى الشاشة الرئيسية</h2></div><button className="icon-btn" onClick={() => setShowIosGuide(false)} aria-label="إغلاق"><X size={19} /></button></div><p className="customer-muted">اتبع الخطوات التالية لتشغيل المتجر كتطبيق مستقل على جهازك:</p><ol className="install-steps"><li><span><Share2 size={18} /></span><b>اضغط زر المشاركة</b> في شريط Safari.</li><li><span className="install-plus">＋</span><b>اختر إضافة إلى الشاشة الرئيسية</b>.</li><li><span><Check size={18} /></span><b>اضغط إضافة</b> لفتح نوفا ماركت من الشاشة الرئيسية.</li></ol><button className="primary-btn" onClick={() => setShowIosGuide(false)}>فهمت</button></div></div>}
  </>;
}
