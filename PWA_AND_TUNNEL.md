# NOVA MARKET — PWA والنفق المؤقت

**آخر تحقق:** 2026-08-07  
**رابط HTTPS الحالي:** https://orders-told-frequent-permits.trycloudflare.com/  
**الخدمة الداخلية:** `http://localhost:3005`  
**عملية PM2:** `market-tunnel`

## ما تم تنفيذه

- Manifest عربي باتجاه RTL مع `standalone` و`scope` و`start_url`.
- أيقونات PNG حقيقية في `public/icons/` بالأحجام 192 و256 و384 و512، مع 512 maskable وأيقونة Apple بحجم 180.
- Service Worker في `public/sw.js` يسجل في الإنتاج فقط.
- Cache by path بدل ربط التخزين باسم مضيف ثابت، حتى يعمل البناء تحت رابط النفق أو الدومين المستقبلي.
- Network-first للتنقل، وCache-first للأصول الثابتة، مع صفحة Offline عربية في `public/offline.html`.
- زر عربي لتثبيت التطبيق في واجهة الزبون.
- تعليمات iOS Safari لإضافة المتجر إلى الشاشة الرئيسية.
- وسوم iOS وApple touch icon داخل `<head>`.
- تم تثبيت `cloudflared` على VPS وتشغيل Quick Tunnel تحت PM2 باسم `market-tunnel`.

## التحقق الحالي

تم التحقق عبر الرابط العام HTTPS من عودة `HTTP 200` للآتي:

- الصفحة الرئيسية.
- `/manifest.webmanifest` بنوع `application/manifest+json`.
- `/sw.js` بنوع JavaScript.
- `/offline.html`.
- الأيقونات الخمس الخاصة بالـ Manifest.
- `/icons/apple-touch-icon.png`.
- وسوم `apple-mobile-web-app-capable` و`apple-mobile-web-app-title` و`apple-touch-icon`.
- Service Worker يحتوي مسارات install/fetch و`networkFirst` و`pathKey` وصفحة Offline.

اختبار التثبيت الفعلي من أجهزة Android وiPhone وDesktop يحتاج فتح الرابط على الأجهزة نفسها. بيئة التنفيذ الحالية تحققت من HTTP وملفات PWA والبناء، لكنها لا تسجل تثبيتًا فعليًا من جهاز مادي.

## أوامر إعادة تشغيل النفق

الاتصال بالسحابة:

~~~bash
ssh -p 2727 ubuntu@65.21.136.217
~~~

إذا كانت العملية موجودة:

~~~bash
export PATH=/home/ubuntu/.nvm/versions/node/v22.22.3/bin:$PATH
pm2 restart market-tunnel --update-env
pm2 save
pm2 logs market-tunnel --lines 80 --nostream
~~~

إذا لم تكن موجودة:

~~~bash
cd /home/ubuntu
pm2 start /usr/bin/cloudflared --name market-tunnel -- tunnel --url http://localhost:3005
pm2 save
~~~

استخراج الرابط الجديد من السجل:

~~~bash
grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' \
  /home/ubuntu/.pm2/logs/market-tunnel-out.log \
  /home/ubuntu/.pm2/logs/market-tunnel-error.log
~~~

قبل إعادة تشغيل النفق، يجب أن تكون Market نفسها Online على `3005`:

~~~bash
pm2 describe market
ss -ltnp | grep ':3005'
curl -I http://127.0.0.1:3005/
~~~

لا يحتاج Cloudflare Quick Tunnel إلى فتح منفذ وارد جديد؛ هو اتصال صادر من VPS إلى Cloudflare، لذلك لم يتم تعديل UFW أو إعدادات المشاريع الأخرى.

## التثبيت على الأجهزة

### Android — Chrome

1. افتح رابط HTTPS في Chrome.
2. انتظر ظهور زر **ثبّت التطبيق** داخل المتجر، أو افتح قائمة Chrome واختر **تثبيت التطبيق**.
3. وافق على التثبيت.
4. افتح NOVA MARKET من الشاشة الرئيسية؛ يجب أن يعمل في نافذة مستقلة مع أيقونة NOVA.

### iPhone — Safari

1. افتح الرابط في Safari مباشرة، وليس داخل متصفح تطبيق آخر.
2. اضغط زر المشاركة.
3. اختر **إضافة إلى الشاشة الرئيسية**.
4. اضغط **إضافة**.
5. افتح الأيقونة من الشاشة الرئيسية. يظهر داخل الموقع أيضًا دليل عربي مختصر للخطوات.

### Desktop — Chrome أو Edge

1. افتح رابط HTTPS.
2. استخدم أيقونة التثبيت في شريط العنوان، أو زر **ثبّت التطبيق** داخل الصفحة.
3. وافق على التثبيت وافتح التطبيق من قائمة التطبيقات.

## ملاحظة مهمة عن الرابط

رابط `trycloudflare.com` هو Quick Tunnel مؤقت بلا حساب Cloudflare. يتغير الرابط عند إعادة تشغيل `market-tunnel` أو إنشاء نفق جديد، لذلك يصلح للعرض والاختبار فقط ولا يصلح كعنوان تجاري دائم.

عند موافقة صاحب المشروع وشراء الدومين، المسار الصحيح هو إنشاء Named Cloudflare Tunnel مرتبط بحساب Cloudflare ودومين رسمي، ثم توجيه اسم مثل `shop.example.com` إلى Market. عندها يصبح الرابط ثابتًا ويمكن اعتماد HTTPS رسمي وسياسة تشغيل إنتاجية.
