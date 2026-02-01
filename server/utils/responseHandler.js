export const successResponse = (
  response,
  statusCode = 200 || 201,
  message = "Success",
  data = {}
) => {
  return response.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  response,
  statusCode = 500,
  message = "Something went wrong",
  error = null
) => {
  return response.status(statusCode).json({
    success: false,
    message,
    error,
  });
};

export const notFoundResponse = (response, message = "Resource not found") => {
  return response.status(404).json({
    success: false,
    message,
  });
};
