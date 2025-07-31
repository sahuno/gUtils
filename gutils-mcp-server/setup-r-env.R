#!/usr/bin/env Rscript

# Setup script for gUtils MCP server R environment

cat("Setting up R environment for gUtils MCP server...\n\n")

# Check and install jsonlite
if (!require("jsonlite", quietly = TRUE)) {
  cat("Installing jsonlite...\n")
  install.packages("jsonlite", repos = "https://cran.r-project.org")
}

# Check if gUtils is available
if (!require("gUtils", quietly = TRUE)) {
  cat("\nWARNING: gUtils package is not installed!\n")
  cat("Since gUtils is in this repository, we'll create a mock environment for testing.\n")
  cat("For full functionality, please install gUtils from the parent directory.\n\n")
  
  # Create mock functions for testing
  parse.gr <- function(x) {
    # Simple mock implementation
    parts <- strsplit(x, "[:-]")[[1]]
    if (length(parts) >= 3) {
      return(list(
        seqnames = parts[1],
        start = as.numeric(parts[2]),
        end = as.numeric(parts[3])
      ))
    }
    stop("Invalid coordinate format")
  }
  
  # Save mock environment
  save(parse.gr, file = "mock_gutils.RData")
  cat("Created mock gUtils functions for testing.\n")
} else {
  cat("gUtils is installed and available.\n")
}

# Check other required packages
required_packages <- c("GenomicRanges", "IRanges", "data.table")
missing_packages <- character()

for (pkg in required_packages) {
  if (!require(pkg, character.only = TRUE, quietly = TRUE)) {
    missing_packages <- c(missing_packages, pkg)
  }
}

if (length(missing_packages) > 0) {
  cat("\nThe following packages are recommended but not installed:\n")
  cat(paste("  -", missing_packages), sep = "\n")
  cat("\nThe MCP server will work with limited functionality.\n")
}

cat("\nSetup complete!\n")