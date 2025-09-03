const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

  // Log request body for POST/PUT requests (excluding sensitive data)
  if ((method === "POST" || method === "PUT") && req.body) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) {
      sanitizedBody.password = "[HIDDEN]";
    }
    console.log(`[${timestamp}] Request Body:`, sanitizedBody);
  }

  next();
};

module.exports = { requestLogger };
