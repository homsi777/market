"use client";
/* eslint-disable @next/next/no-html-link-for-pages, react-hooks/set-state-in-effect */

import { FormEvent, useEffect, useState } from "react";
import { Check, Pencil, Plus, Trash2, X, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

type Category = { id: number; name: string; slug: string; products: number; icon: string };
const initial: Category[] = [
  { id: 1, name: "إلكترونيات", slug: "electronics", products: 12, icon: "◈" },
  { id: 2, name: "أدوات منزلية", slug: "home", products: 18, icon: "⌂" },
  { id: 3, name: "أزياء", slug: "fashion", products: 9, icon: "◌" },
  { id: 4, name: "أطفال", slug: "kids", products: 7, icon: "✦" },
  { id: 5, name: "العناية", slug: "care", products: 11, icon: "✧" },
  { id: 6, name: "رياضة", slug: "sport", products: 8, icon: "↗" },
];

export default function AdminCategoriesPage() {
  const router = useRouter(); const [ready, setReady] = useState(false); const [categories, setCategories] = useState(initial); const [editing, setEditing] = useState<Category | null>(null); const [showForm, setShowForm] = useState(false); const [saved, setSaved] = useState("");
  useEffect(() => { if (localStorage.getItem("nova-admin-auth") !== "1") router.replace("/admin"); else setReady(true); }, [router]);
  const save = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); const name = String(form.get("name") || "").trim(); const slug = String(form.get("slug") || name.toLowerCase().replace(/\s+/g, "-")).trim(); if (!name) return; if (editing) setCategories(items => items.map(item => item.id === editing.id ? { ...item, name, slug } : item)); else setCategories(items => [...items, { id: Date.now(), name, slug, products: 0, icon: "✦" }]); setShowForm(false); setEditing(null); setSaved("تم حفظ القسم محلياً."); setTimeout(() => setSaved(""), 2200); };
  if (!ready) return null;
  return <div className="admin-shell content-layer"><aside className="admin-sidebar"><div className="admin-brand"><a href="/admin" className="brand"><span className="brand-mark"><Zap size={17} fill="currentColor" /></span><strong>NOVA</strong><span>ADMIN</span></a></div><nav className="admin-nav"><a href="/admin">لوحة المعلومات</a><a href="/admin/products">المنتجات</a><a className="active" href="/admin/categories">الأقسام</a><a href="/admin/orders">الطلبات</a><a href="/admin/inventory">المخزون</a><a href="/admin/promotions">العروض</a><a href="/admin/settings">الإعدادات</a></nav></aside><section className="admin-main"><header className="admin-header"><div className="eyebrow" style={{ margin: 0 }}>مساحة الإدارة · تنظيم المتجر</div></header><div className="admin-content"><div className="admin-title"><div><h1>الأقسام</h1><p>أنشئ أقسام المتجر وعدّلها لتظهر مباشرة في واجهة الزبون.</p></div><button className="primary-btn" onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={17} /> قسم جديد</button></div>{saved && <div className="status status-green" style={{ marginBottom: 15 }}>{saved}</div>}{showForm && <form className="panel" style={{ marginBottom: 18 }} onSubmit={save}><div className="form-grid"><div className="form-group"><label>اسم القسم</label><input className="form-control" name="name" required defaultValue={editing?.name || ""} placeholder="مثال: أدوات مكتبية" /></div><div className="form-group"><label>الرابط المختصر</label><input className="form-control" name="slug" defaultValue={editing?.slug || ""} placeholder="office-tools" /></div></div><div className="actions" style={{ marginTop: 17 }}><button className="primary-btn" type="submit"><Check size={16} /> حفظ القسم</button><button className="secondary-btn" type="button" onClick={() => { setShowForm(false); setEditing(null); }}><X size={16} /> إلغاء</button></div></form>}<div className="panel table-wrap"><table><thead><tr><th>الأيقونة</th><th>اسم القسم</th><th>الرابط</th><th>عدد المنتجات</th><th>الإجراءات</th></tr></thead><tbody>{categories.map(category => <tr key={category.id}><td style={{ fontSize: 22, color: "var(--cyan)" }}>{category.icon}</td><td>{category.name}</td><td className="font-orbitron">/{category.slug}</td><td>{category.products}</td><td><button className="icon-btn" style={{ width: 34, height: 34 }} aria-label="تعديل القسم" onClick={() => { setEditing(category); setShowForm(true); }}><Pencil size={15} /></button><button className="icon-btn" style={{ width: 34, height: 34 }} aria-label="حذف القسم" onClick={() => setCategories(items => items.filter(item => item.id !== category.id))}><Trash2 size={15} /></button></td></tr>)}</tbody></table></div></div></section></div>;
}
