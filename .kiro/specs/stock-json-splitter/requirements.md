# Requirements Document

## Introduction

The current stock.json file in the bogavante-stock directory is massive (1803+ lines) and difficult to manage. This feature will split the large stock.json file into smaller, more manageable files organized by "categoria" (category). Each category will have its own JSON file, making it easier to maintain, update, and work with specific product categories.

## Requirements

### Requirement 1

**User Story:** As a developer, I want to split the massive stock.json file by category, so that I can work with smaller, more manageable files for each product category.

#### Acceptance Criteria

1. WHEN the splitter tool is executed THEN the system SHALL read the existing stock.json file
2. WHEN processing the stock data THEN the system SHALL group all items by their "categoria" field
3. WHEN creating output files THEN the system SHALL generate one JSON file per unique category
4. WHEN naming output files THEN the system SHALL use kebab-case format based on the category name (e.g., "fresco-marino.json")
5. WHEN writing category files THEN the system SHALL maintain the original JSON structure for each item within the category

### Requirement 2

**User Story:** As a developer, I want the split files to be properly formatted and organized, so that they remain easy to read and maintain.

#### Acceptance Criteria

1. WHEN creating category files THEN the system SHALL format each JSON file with proper indentation
2. WHEN organizing items within each category file THEN the system SHALL preserve the original order of items
3. WHEN generating file names THEN the system SHALL handle special characters and spaces in category names appropriately
4. WHEN creating files THEN the system SHALL place all split files in the same bogavante-stock directory

### Requirement 3

**User Story:** As a developer, I want to verify the split was successful, so that I can ensure no data was lost during the process.

#### Acceptance Criteria

1. WHEN the split process completes THEN the system SHALL provide a summary of how many items were written to each category file
2. WHEN validating the split THEN the system SHALL verify that the total number of items across all category files equals the original count
3. WHEN reporting results THEN the system SHALL list all created files with their respective item counts
4. IF any errors occur during processing THEN the system SHALL provide clear error messages indicating what went wrong

### Requirement 4

**User Story:** As a developer, I want the tool to handle edge cases gracefully, so that the splitting process is robust and reliable.

#### Acceptance Criteria

1. IF an item has no "categoria" field THEN the system SHALL place it in an "uncategorized.json" file
2. IF an item has an empty or null "categoria" value THEN the system SHALL place it in an "uncategorized.json" file
3. WHEN encountering invalid JSON structure THEN the system SHALL report the error and continue processing valid items
4. WHEN creating file names from categories THEN the system SHALL handle Unicode characters and special symbols appropriately
