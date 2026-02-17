# Design Document

## Overview

The Stock JSON Splitter is a Node.js utility that processes the large stock.json file and splits it into smaller, category-specific JSON files. The tool will read the existing stock.json, group items by their "categoria" field, and create separate files for each category in the same directory.

## Architecture

The solution follows a simple, functional architecture with clear separation of concerns:

```
Input: stock.json (1803+ items)
    ↓
Parser: Read and validate JSON
    ↓
Grouper: Group items by categoria
    ↓
File Generator: Create category-specific files
    ↓
Output: Multiple JSON files (fresco-marino.json, conservas-latas-frascos.json, etc.)
```

## Components and Interfaces

### 1. File Reader Component

- **Purpose**: Read and parse the stock.json file
- **Input**: File path to stock.json
- **Output**: Array of stock items
- **Error Handling**: Validates JSON structure and reports parsing errors

### 2. Category Grouper Component

- **Purpose**: Group stock items by their categoria field
- **Input**: Array of stock items
- **Output**: Map/Object with categoria as key and array of items as value
- **Logic**:
  - Extract categoria from each item
  - Handle missing/null/empty categoria values
  - Group items into categories

### 3. File Name Generator Component

- **Purpose**: Convert category names to valid file names
- **Input**: Category name string
- **Output**: Kebab-case file name with .json extension
- **Logic**:
  - Convert to lowercase
  - Replace spaces and special characters with hyphens
  - Handle Unicode characters
  - Remove consecutive hyphens

### 4. File Writer Component

- **Purpose**: Write category groups to individual JSON files
- **Input**: Category groups map and output directory
- **Output**: Individual JSON files for each category
- **Features**:
  - Pretty-print JSON with proper indentation
  - Preserve original item order within categories
  - Write to bogavante-stock directory

### 5. Summary Reporter Component

- **Purpose**: Provide feedback on the splitting process
- **Input**: Processing results and file statistics
- **Output**: Console summary with file counts and validation
- **Features**:
  - List all created files with item counts
  - Verify total item count matches original
  - Report any errors or warnings

## Data Models

### Stock Item

```typescript
interface StockItem {
  categoria: string
  subcategoria: string
  producto: string
  presentacion: string
  unidad: string
  ejemplos_notas: string
}
```

### Category Group

```typescript
interface CategoryGroup {
  [categoria: string]: StockItem[]
}
```

### Processing Result

```typescript
interface ProcessingResult {
  totalItems: number
  categoriesCreated: number
  filesWritten: string[]
  errors: string[]
  summary: {
    [fileName: string]: number // item count per file
  }
}
```

## Error Handling

### File System Errors

- Handle file not found errors for input file
- Handle permission errors when writing output files
- Provide clear error messages for file system issues

### Data Validation Errors

- Validate JSON structure of input file
- Handle malformed JSON gracefully
- Continue processing valid items when encountering invalid ones

### Category Processing Errors

- Handle items with missing categoria field
- Process items with null/empty categoria values
- Create "uncategorized.json" for problematic items

## Testing Strategy

### Unit Tests

- Test file name generation with various category names
- Test category grouping with different data scenarios
- Test error handling for malformed data
- Test JSON parsing and writing functionality

### Integration Tests

- Test complete workflow with sample data
- Test file creation and content validation
- Test summary reporting accuracy
- Test error scenarios end-to-end

### Test Data Scenarios

- Normal categories (e.g., "Fresco - Marino")
- Categories with special characters
- Items with missing categoria field
- Items with null/empty categoria values
- Malformed JSON items

## Implementation Notes

### File Naming Strategy

Categories will be converted to file names using this logic:

- "Fresco - Marino" → "fresco-marino.json"
- "Conservas/Latas/Frascos" → "conservas-latas-frascos.json"
- "Ahumados/Curados" → "ahumados-curados.json"

### Output Directory

All split files will be created in the `bogavante-stock/` directory alongside the original stock.json file.

### Performance Considerations

- Process file in memory (acceptable for current file size)
- Use streaming if file size grows significantly in the future
- Batch write operations for efficiency

### Validation

- Count total items before and after splitting
- Verify all categories are represented
- Ensure no data loss during the process
