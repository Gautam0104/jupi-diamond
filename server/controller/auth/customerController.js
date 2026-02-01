import {
  checkCustomerSession,
  deleteCustomer,
  getAllCustomer,
  getCustomer,
  loginCustomer,
  registerCustomer,
  updateCustomer,
} from "../../services/auth/customerService.js";

export async function customerRegister(requset, response, next) {
  try {
    const result = await registerCustomer(requset.body, requset.session);
    console.log("result=", result);
    return response.status(201).json({
      message: "User Registered successfully",
      data: result,
    });
  } catch (error) {
    console.error(`Error in customer Registration ${error}`);

    // const prismaError = handlePrismaError(error);

    return response.json({
      statusCode: error.statusCode,
      message: error.message,
      code: error.code,
    });
  }
}

//fetch customer.......................
export async function fetchCustomer(req, res, next) {
  try {
    const customerId = req.session?.user?.id;
    const result = await getCustomer(customerId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Unexpected error",
    });
  }
}
//fetch all customer.......................
export async function getAllCustomers(req, res, next) {
  try {
    const result = await getAllCustomer(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Unexpected error",
    });
  }
}

export async function customerLogin(req, res, next) {
  try {
    const result = await loginCustomer(req.body, req.session);
    return res.status(200).json({
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {
    console.error(`Error in customer Login ${error}`);
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
      statusCode: error.statusCode,
      code: error.code || "UNKNOWN",
    });
  }
}

export const updateCustomerController = async (req, res) => {
  try {
    const customerId = req.session?.user?.id;
    if (!customerId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Please login to continue" });
    }

    const result = await updateCustomer(customerId, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Unexpected error",
    });
  }
};

export const checkSession = async (req, res) => {
  try {
    const customerId = req.session?.user?.id;
    const session = await checkCustomerSession(customerId);

    return res.status(200).json({
      message: "Active session found",
      isLoggedIn: true,
      data: session,
    });
  } catch (error) {
    console.error(`Error checking session: ${error}`);
    return res.status(500).json({
      message: "Error checking session status",
      error: error.message,
    });
  }
};


export const deleteCustomerController = async (req, res) => {
  try {
    const customerId = req.params?.id;
    if (!customerId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Please login to continue" });
    }

    const result = await deleteCustomer(customerId);
    
    // Destroy the session after successful deletion
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
      }
    });

    return res.status(200).json({
      message: "Customer account deleted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Unexpected error during account deletion",
    });
  }
};