# EL ORÁCULO DE CHALAMANDRA

Aplicación web en **Next.js + TypeScript** para decodificar decisiones complejas con marcos de pensamiento estratégicos.

## Arquitectura (limpia y lista para Vercel)

```txt
/components
  |_ cta/CtaSection.tsx
  |_ forms/OracleForm.tsx
  |_ layout/Header.tsx
  |_ oracle/QuestionsPanel.tsx
/lib
  |_ api.ts
  |_ oracleService.ts
  |_ questionBank.ts
  |_ types.ts
/pages
  |_ _app.tsx
  |_ demo.tsx
  |_ favorites.tsx
  |_ index.tsx
  /api
    |_ favorites.ts
    |_ feedback.ts
    |_ generate.ts
    |_ setup-db.ts
/styles
  |_ globals.css
```

## Despliegue

El proyecto está configurado para un despliegue automático en Vercel.

