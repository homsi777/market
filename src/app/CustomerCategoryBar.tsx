"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import { ArrowLeft } from "lucide-react";

const categories = [["إلكترونيات", "◈", "electronics"], ["المنزل", "⌂", "home"], ["أزياء", "◌", "fashion"], ["أطفال", "✦", "kids"], ["العناية", "✧", "care"], ["رياضة", "↗", "sport"]];

export default function CustomerCategoryBar() {
  return <div className="customer-category-bar"><div className="customer-category-inner"><span className="customer-category-label">تسوق حسب القسم</span><div className="customer-category-scroll">{categories.map(([name, icon, slug]) => <a href={`/category/${slug}`} className="customer-category-chip" key={slug}><span>{icon}</span>{name}</a>)}</div><a className="customer-category-all" href="/category/electronics">كل الأقسام <ArrowLeft size={15} /></a></div></div>;
}
