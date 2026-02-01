// authMiddleware.js
export const isAuthenticated = (req, res, next) => {
    const userId = req.session.userId; // Assuming you are using sessions
  
    if (!userId) {
      return res.status(401).json({
        message: "User is not logged in. Please log in to create a cart.",
        success: false,
      });
    }
  
    // If logged in, proceed to the next middleware
    next();
  };
  