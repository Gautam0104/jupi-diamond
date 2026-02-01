export async function userLogout(req) {
  // console.log("Session object in userLogout:", req.session);
  return new Promise((resolve, reject) => {
    if (req.session) {
      // Check user role
      const userRole = req.session?.user?.role ;
      // console.log("userRole==>", userRole);
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return reject({ status: 500, message: "Failed to log out" });
        }

        // Clear all cookies regardless of role
        req.res.clearCookie("connect.sid");
        // req.res.clearCookie("connect.sid");

        return resolve({
          status: 200,
          message: `${userRole} logged out successfully`,
          role: userRole
        });
      });
    } else {
      return reject({ status: 400, message: "No active session found" });
    }
  });
}


export async function adminLogout(req) {
  // console.log("Session object in adminLogout:", req.session);
  return new Promise((resolve, reject) => {
    if (req.session) {
      // Check admin role
      const adminRole = req.session?.admin?.role;
      // console.log("adminRole==>", adminRole);
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return reject({ status: 500, message: "Failed to log out" });
        }

        // Clear all cookies regardless of role
        req.res.clearCookie("connect.sid");
        // req.res.clearCookie("connect.sid");

        return resolve({
          status: 200,
          message: `${adminRole} logged out successfully`,
          role: adminRole
        });
      });
    } else {
      return reject({ status: 400, message: "No active session found" });
    }
  });
}
