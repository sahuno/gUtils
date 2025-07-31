# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## this is a rich R package for genomics analysis with hand-curated functions and operations

Goals: 
1. Extensitvely document the functions/tools and make it easy to use
2. Extend this into an MCP that can work with AI LLM and AI agents

## TO DO
1. create md file of all the user exposed functions. in the md file group functions by common operations and make 1-2 sentences max of what they do and recommended inputs. Highlight functions that may be simmilar and make a reference to the function they are similar to
2. create a plan md with phases of implmentation for creating an MCP server out of the package.
3.  

## Package Overview

gUtils is an R package that extends GenomicRanges with additional capabilities and syntactic sugar for genomic interval operations. It provides intuitive operators for overlap analysis, interval arithmetic, and metadata manipulation, making genomic data science more accessible.

## Development Commands

### Testing
```r
# Run all tests
devtools::test()

# Run specific test file
testthat::test_file("tests/testthat/test_rangeops.R")

# Check package (includes running tests)
devtools::check()
```

### Building and Installation
```r
# Install development version
devtools::install()

# Build package
devtools::build()

# Document package (regenerate .Rd files from roxygen comments)
devtools::document()

# Load package for development
devtools::load_all()
```

### Linting
The package uses standard R linting practices. Run checks with:
```r
# Full package check (includes code quality checks)
devtools::check()

# Check specific aspects
devtools::check_man()  # Check documentation
devtools::check_examples()  # Check examples run correctly
```

## Package Architecture

### Core Components

1. **Main Source File**: `R/gUtils.R` contains all package functions
2. **Operator Overloads**: The package extensively uses custom operators (e.g., `%Q%`, `%*%`, `%O%`) to provide syntactic sugar for genomic operations
3. **Data Integration**: Built-in datasets in `data/` for examples and testing
4. **External Data**: Reference genomes and annotations in `inst/extdata/`

### Key Function Categories

1. **Overlap Operations**: Functions prefixed with `gr.` that handle interval overlaps
2. **Metadata Operations**: Functions for manipulating GRanges metadata columns
3. **Interval Arithmetic**: Operations for shifting, resizing, and transforming intervals
4. **Utility Functions**: Helper functions for common genomic tasks

### Testing Strategy

- Tests are in `tests/testthat/test_rangeops.R`
- Uses `testthat` framework
- Tests cover core range operations, operator overloads, and edge cases
- Test data includes example genomic coordinates and expected outputs

## Important Development Notes

1. **R Version**: Requires R >= 3.5.0
2. **Dependencies**: Core dependencies include GenomicRanges, IRanges, data.table
3. **Documentation**: Uses roxygen2 (7.3.2) - always update roxygen comments when modifying functions
4. **Namespace**: When adding new functions, ensure proper export in roxygen comments
5. **Data Files**: Reference genome files are in `inst/extdata/` - these are large binary files

## CI/CD

- GitHub Actions workflow for R-CMD-check on Ubuntu with R 4.0.2
- Automated code coverage reporting via codecov
- Checks run on push and pull requests
