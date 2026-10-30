# Graph Report - Landing_page-ICU  (2026-10-21)

## Corpus Check
- 30 files · ~35,181 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .example 1, .lock 1)

## Summary
- 190 nodes · 431 edges · 11 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `891f7782`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.tsx
- package.json
- BrandContext.tsx
- CurriculumEditor.tsx
- CurriculumView.tsx
- compilerOptions
- dependencies
- TangramLoader.tsx
- devDependencies
- KlmView.tsx
- ShowreelPlayer.tsx

## God Nodes (most connected - your core abstractions)
1. `useBrand()` - 32 edges
2. `react` - 22 edges
3. `BrandContextType` - 17 edges
4. `MainContent()` - 16 edges
5. `compilerOptions` - 15 edges
6. `CurriculumEditor()` - 12 edges
7. `CurriculumView()` - 10 edges
8. `validateNotEmpty()` - 10 edges
9. `LandingPublicaView()` - 9 edges
10. `validatePeriod()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `MainContent()` --calls--> `CurriculumView()`  [EXTRACTED]
  src/App.tsx → src/components/CurriculumView.tsx
- `MainContent()` --calls--> `LandingPublicaView()`  [EXTRACTED]
  src/App.tsx → src/components/LandingPublicaView.tsx
- `MainContent()` --calls--> `NuevoEventoModal()`  [EXTRACTED]
  src/App.tsx → src/components/NuevoEventoModal.tsx
- `MainContent()` --calls--> `TangramLoader()`  [EXTRACTED]
  src/App.tsx → src/components/TangramLoader.tsx
- `ColoresView()` --calls--> `validateNotEmpty()`  [EXTRACTED]
  src/components/ColoresView.tsx → src/utils/validation.ts

## Import Cycles
- None detected.

## Communities (11 total, 0 thin omitted)

### Community 0 - "App.tsx"
Cohesion: 0.17
Nodes (19): react, react-dom, react-easy-crop, App(), MainContent(), AjustesModal(), ColoresView(), DashboardView() (+11 more)

### Community 1 - "package.json"
Cohesion: 0.07
Nodes (27): name, private, scripts, build, clean, dev, lint, preview (+19 more)

### Community 2 - "BrandContext.tsx"
Cohesion: 0.19
Nodes (25): BrandContext, BrandContextType, defaultColors, defaultCurriculumData, defaultTypography, initialActivities, initialEvents, initialFonts (+17 more)

### Community 3 - "CurriculumEditor.tsx"
Cohesion: 0.27
Nodes (15): CurriculumEditor(), CurriculumEditorProps, LandingPublicaView(), NuevoEventoModal(), extractYearFromStr(), formatPeriod(), parsePeriod(), PeriodValidationOptions (+7 more)

### Community 4 - "CurriculumView.tsx"
Cohesion: 0.22
Nodes (13): CurriculumDocument(), CurriculumDocumentProps, CurriculumThemeConfig, curriculumThemes, CurriculumPreviewControls(), CurriculumPreviewControlsProps, CurriculumView(), CurriculumViewMode (+5 more)

### Community 5 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+7 more)

### Community 6 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, dotenv, express, @google/genai, html2canvas, html-to-image, jspdf, lucide-react (+7 more)

### Community 7 - "TangramLoader.tsx"
Cohesion: 0.22
Nodes (10): easeInOutCubic(), FIGURES, PIECE_COLORS, PIECE_PARAMS, RAW_FIGURES, scatterCurve(), TangramFigure, TangramLoader() (+2 more)

### Community 8 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, autoprefixer, esbuild, tailwindcss, tsx, @types/express, @types/node, typescript (+1 more)

### Community 9 - "KlmView.tsx"
Cohesion: 0.36
Nodes (6): lucide-react, calculateCurriculumKlm(), KLM_STANDARD_OPERATORS, KlmAnalysisReport, KlmOperatorDefinition, KlmTaskStep

### Community 10 - "ShowreelPlayer.tsx"
Cohesion: 0.60
Nodes (4): formatTime(), parseTime(), ShowreelPlayer(), ShowreelPlayerProps

## Knowledge Gaps
- **75 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+70 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 79 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `package.json`, `BrandContext.tsx`, `CurriculumEditor.tsx`, `CurriculumView.tsx`, `TangramLoader.tsx`, `KlmView.tsx`, `ShowreelPlayer.tsx`?**
  _High betweenness centrality (0.350) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07126436781609195 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._