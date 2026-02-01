export const checkSession = (req, res) => {
     if (req.session?.user) {
       return res.status(200).json({
         message: "User is authenticated",
         user: req.session.user,
         isAuthenticated: true,
       });
     }
     return res
       .status(401)
       .json({ message: "User is not authenticated", isAuthenticated: false });
   };