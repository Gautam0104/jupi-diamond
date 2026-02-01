import { Prisma } from "@prisma/client";

export function handlePrismaError(error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2000":
        return {
          statusCode: 400,
          message: `Value too long for field: ${error.meta?.target?.join(", ")}`,
          code: "VALUE_TOO_LONG",
        };

      case "P2001":
        return {
          statusCode: 404,
          message: `Required record not found for condition: ${error.meta?.target?.join(", ")}`,
          code: "RECORD_NOT_FOUND",
        };

      case "P2002":
        return {
          statusCode: 409,
          message: `Duplicate entry: ${error.meta?.target?.join(", ")}`,
          code: "DUPLICATE_ENTRY",
        };

      case "P2003":
        return {
          statusCode: 400,
          message: `Foreign key constraint failed on: ${error.meta?.field_name}`,
          code: "FK_CONSTRAINT_FAILED",
        };

      case "P2004":
        return {
          statusCode: 400,
          message: "Database constraint failed",
          code: "CONSTRAINT_FAILED",
        };

      case "P2005":
        return {
          statusCode: 400,
          message: "Invalid value for field",
          code: "INVALID_VALUE",
        };

      case "P2006":
        return {
          statusCode: 400,
          message: "Missing value for required field",
          code: "MISSING_REQUIRED_VALUE",
        };

      case "P2007":
        return {
          statusCode: 400,
          message: "Data validation error",
          code: "VALIDATION_FAILED",
        };

      case "P2008":
        return {
          statusCode: 500,
          message: "Failed to parse query",
          code: "QUERY_PARSING_FAILED",
        };

      case "P2009":
        return {
          statusCode: 500,
          message: "Failed to validate query",
          code: "QUERY_VALIDATION_FAILED",
        };

      case "P2010":
        return {
          statusCode: 500,
          message: "Raw query failed",
          code: "RAW_QUERY_FAILED",
        };

      case "P2011":
        return {
          statusCode: 400,
          message: "Null constraint violation",
          code: "NULL_CONSTRAINT_VIOLATION",
        };

      case "P2012":
        return {
          statusCode: 400,
          message: `Missing required value: ${error.meta?.field_name}`,
          code: "MISSING_REQUIRED_FIELD",
        };

      case "P2013":
        return {
          statusCode: 400,
          message: "Missing required argument in query",
          code: "MISSING_QUERY_ARGUMENT",
        };

      case "P2014":
        return {
          statusCode: 400,
          message:
            "Relation violation: The change would violate a required relation",
          code: "RELATION_VIOLATION",
        };

      case "P2015":
        return {
          statusCode: 404,
          message: "Record not found",
          code: "RECORD_NOT_FOUND",
        };

      case "P2016":
        return {
          statusCode: 400,
          message: "Query interpretation error",
          code: "QUERY_INTERPRETATION_ERROR",
        };

      case "P2017":
        return {
          statusCode: 400,
          message: "Records for relation not connected",
          code: "RELATION_NOT_CONNECTED",
        };

      case "P2018":
        return {
          statusCode: 500,
          message: "Required connected records not found",
          code: "CONNECTED_RECORDS_NOT_FOUND",
        };

      case "P2019":
        return {
          statusCode: 400,
          message: "Input error",
          code: "INPUT_ERROR",
        };

      case "P2020":
        return {
          statusCode: 400,
          message: "Value out of range",
          code: "VALUE_OUT_OF_RANGE",
        };

      case "P2021":
        return {
          statusCode: 400,
          message: "Table does not exist in database",
          code: "TABLE_NOT_FOUND",
        };

      case "P2022":
        return {
          statusCode: 400,
          message: "Field does not exist in database",
          code: "COLUMN_NOT_FOUND",
        };

      case "P2023":
        return {
          statusCode: 400,
          message: "Inconsistent column data",
          code: "INCONSISTENT_COLUMN_DATA",
        };

      case "P2024":
        return {
          statusCode: 500,
          message: "Timed out fetching connection",
          code: "DB_TIMEOUT",
        };

      case "P2025":
        return {
          statusCode: 404,
          message: "Record to update/delete does not exist",
          code: "RECORD_NOT_FOUND",
        };

      case "P2026":
        return {
          statusCode: 500,
          message: "Operation failed due to connection limitations",
          code: "DB_CONNECTION_FAILED",
        };

      case "P2030":
        return {
          statusCode: 400,
          message: "Cannot start a transaction within a transaction",
          code: "NESTED_TRANSACTION",
        };

      case "P2031":
        return {
          statusCode: 500,
          message: "Transaction API error",
          code: "TRANSACTION_API_ERROR",
        };

      case "P2033":
        return {
          statusCode: 400,
          message: "Invalid `id` or scalar condition",
          code: "INVALID_SCALAR_CONDITION",
        };

      default:
        return {
          statusCode: 400,
          message: `Unhandled Prisma error (code: ${error.code})`,
          code: error.code,
        };
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      statusCode: 400,
      message: "Validation error: Invalid or missing input",
      code: "VALIDATION_ERROR",
    };
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      statusCode: 500,
      message: "Database initialization failed",
      code: "DB_INIT_FAILED",
    };
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return {
      statusCode: 500,
      message: "Unexpected internal database error",
      code: "RUST_PANIC",
    };
  }

  return {
    statusCode: 500,
    message: "Unknown server error",
    code: "INTERNAL_SERVER_ERROR",
  };
}
