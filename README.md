# EL ORÁCULO DE CHALAMANDRA

Aplicación web en **Next.js + TypeScript** para decodificar decisiones complejas con marcos de pensamiento estratégicos.

## Arquitectura (limpia y lista para Vercel)

```txt
/pages
  |_ index.tsx
  |_ demo.tsx
  |_ _app.tsx
/components
  |_ layout/Header.tsx
  |_ forms/OracleForm.tsx
  |_ oracle/QuestionsPanel.tsx
  |_ cta/CtaSection.tsx
/lib
  |_ types.ts
  |_ questionBank.ts
  |_ oracleService.ts
/styles
  |_ globals.css
```

## Mejoras aplicadas

- Eliminación de duplicados y legado estático (`assets/*.min.*`, HTML plano inicial).
- Separación UI/lógica con componentes reutilizables.
- Tipado estricto TypeScript en métodos, contextos y servicios.
- Fallback local cuando Gemini no está disponible.
- Proyecto preparado para despliegue directo en Vercel (`vercel.json`).

## Ejecutar local

```bash
npm install
npm run dev
```

## Variables de entorno

Crear `.env.local`:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=tu_api_key
```

## Deploy

1. Conecta el repo en Vercel.
2. Configura `NEXT_PUBLIC_GEMINI_API_KEY` en Project Settings.
3. Deploy automático.
