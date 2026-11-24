# Security policy

- لا ترفع `.env` أو `.env.local` أو service-account JSON أو private keys إلى Git.
- إعداد Firebase Web الظاهر للمتصفح ليس Admin credential؛ الحماية الحقيقية موجودة في Authentication وFirestore/Storage Rules.
- تعيين الأدوار يتم من Cloud Function عبر Custom Claims، وليس من الواجهة.
- لا تعتمد على إخفاء الأزرار كحماية؛ كل قراءة وكتابة يجب أن تمر عبر Firebase Rules.
- قبل كل نشر شغّل:

```bash
npm audit --omit=dev
npm run build
npm run check
```

للإبلاغ عن مشكلة أمنية، لا تنشر التفاصيل في issue عام؛ استخدم قناة خاصة مع مالك المستودع.
