# Implementation Plan

- [x] 1. Set up project structure and core utilities

  - Create the main splitter script file in the bogavante-stock directory
  - Set up basic Node.js structure with proper imports and exports
  - Create utility functions for file operations
  - _Requirements: 1.1, 1.2_

- [x] 2. Implement file reading and JSON parsing

  - Write function to read the stock.json file from the filesystem
  - Add JSON parsing with error handling for malformed data
  - Create validation to ensure the parsed data is an array
  - Write unit tests for file reading and parsing functionality
  - _Requirements: 1.1, 4.3_

- [x] 3. Create category grouping functionality

  - Implement function to group stock items by their "categoria" field
  - Handle items with missing, null, or empty categoria values
  - Create logic to place problematic items in "uncategorized" group
  - Write unit tests for category grouping with various data scenarios
  - _Requirements: 1.2, 4.1, 4.2_

- [x] 4. Implement file name generation utility

  - Create function to convert category names to kebab-case file names
  - Handle special characters, spaces, and Unicode characters appropriately
  - Add logic to remove consecutive hyphens and clean up file names
  - Write unit tests for file name generation with edge cases
  - _Requirements: 1.4, 2.3, 4.4_

- [x] 5. Build file writing functionality

  - Implement function to write category groups to individual JSON files
  - Add proper JSON formatting with indentation for readability
  - Ensure files are written to the bogavante-stock directory
  - Preserve original item order within each category file
  - Write unit tests for file writing operations
  - _Requirements: 1.5, 2.1, 2.2, 2.4_

- [x] 6. Create summary reporting system

  - Implement function to count items in each category
  - Add validation to verify total item count matches original
  - Create console output showing created files and their item counts
  - Add error reporting for any issues encountered during processing
  - Write unit tests for summary reporting functionality
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 7. Integrate all components into main execution flow

  - Create main function that orchestrates the entire splitting process
  - Add proper error handling and graceful failure recovery
  - Implement the complete workflow from reading to writing to reporting
  - Add command-line interface for running the splitter
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 8. Add comprehensive error handling

  - Implement try-catch blocks for all file operations
  - Add specific error messages for different failure scenarios
  - Create fallback behavior for recoverable errors
  - Ensure the tool continues processing when encountering invalid items
  - Write unit tests for error handling scenarios
  - _Requirements: 3.4, 4.1, 4.2, 4.3_

- [ ] 9. Create integration tests and validation

  - Write integration test that processes the actual stock.json file
  - Add test to verify all categories are properly split
  - Create validation test to ensure no data loss occurs
  - Test the complete workflow with edge cases and error scenarios
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 10. Add execution script and documentation
  - Create package.json script for easy execution of the splitter
  - Add README with usage instructions and examples
  - Include sample output showing what files will be created
  - Document any prerequisites or setup requirements
  - _Requirements: 1.1, 2.4_
