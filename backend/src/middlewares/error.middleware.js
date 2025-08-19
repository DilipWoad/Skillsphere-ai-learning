const globalErrorHandling = async (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Log the error for debugging purposes, especially in development
  console.error(`[ERROR] ${statusCode} - ${err.message} \n ${err.stack}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Only include the errors array if it exists on the error object
    ...(err.errors && { errors: err.errors }),
  });
};

export { globalErrorHandling };
