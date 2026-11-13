# Course Catalogue Application

A responsive course catalogue built with React, TypeScript, and Tailwind CSS.

Developed as part of the [QualityLink project](https://quality-link.eu/).

Funded by the European Union. Views and opinions expressed are however those of the authors only and do not necessarily reflect those of the European Union or Erasmus+ National Agency for Higher Education (German Academic Exchange Service). Neither the European Union nor the granting authority can be held responsible for them.

![Co-founded by the European Union](eu-co-funded.png)

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will run on `http://localhost:5173`.

### Environment variables

| Variable | Description |
|---|---|
| `VITE_MEILISEARCH_HOST` | Meilisearch host (required) |
| `VITE_MEILISEARCH_KEY` | Meilisearch search key (required) |
| `VITE_MEILISEARCH_INDEX` | Meilisearch index name (default `ql_courses`) |
| `VITE_API_BASE_URL` | Base URL of the QualityLink backend, used for EDC credential template downloads (`/api/v1/courses/{uuid}/edc-template`). Empty = same origin as the frontend. If the backend is on another origin, it must allow CORS from the catalogue's origin (and expose `Content-Disposition` for proper file names). |

---

## Theme Settings

Edit `src/theme.ts` to customize:
- **Colors**: `primary`, `primaryHover`, `link`
- **Logo**: `url`, `name`
- **Fonts**: `primary`

---

## Data Structure

### Course List
- **Location:** `src/mockData.ts`
- Basic course info for catalogue page (title, university, image, ects, etc.)

### Course Details
- **Location:** `src/mockCourseDetail.ts`
- Full course data with tabs and content sections

### Tab → Section → Field Structure

Every tab uses the same consistent structure:

```
Tab
 └─ content: Section[]
     └─ Section
         ├─ title?: string (optional - shown as header if defined)
         └─ fields: Field[]
             └─ Field (one of 6 types)
```

**Section**: A group of related fields
- `title?: string` - Optional header (e.g., "Teaching methods and pedagogy")
- `fields: Field[]` - Array of field objects

**Field Types**: All fields have `type`, `label`, and type-specific properties:

1. **info-card** - Information card in a grid
```typescript
{ type: 'info-card', label: 'WORKLOAD', value: '5 ECTS', tooltip?: 'Optional' }
```

2. **text** - Simple text field
```typescript
{ type: 'text', label: 'DESCRIPTION', value: 'Text...', tooltip?: 'Optional' }
```

3. **list** - Bulleted list
```typescript
{ type: 'list', label: 'LEARNING OUTCOMES', items: ['Item 1', 'Item 2'], tooltip?: 'Optional' }
```

4. **provider** - Provider with link
```typescript
{ type: 'provider', label: 'PROVIDER', name: 'University Name', link: 'https://...', tooltip?: 'Optional' }
```

5. **skills** - Skill with optional ESCO link
```typescript
{ type: 'skills', label: 'SKILLS', name: 'Skill name', escoLink?: 'https://...', tooltip?: 'Optional' }
```

6. **link** - Text with optional link and subtitle
```typescript
{
  type: 'link',
  label: 'FIELD NAME',
  value: 'Text' | ['Line 1', 'Line 2'],
  subtitle?: 'Optional subtitle',
  linkText?: 'Learn more',
  linkUrl?: 'https://...',
  tooltip?: 'Optional'
}
```

`src/types.ts` for full definitions
