import { uploadFilesToS3 } from "../../middleware/aws.file.stream.js";
import orderService from "../../services/order/orderService.js";

const orderController = {
  async createOrder(req, res) {
    const customerId = req.session?.user?.id;
    try {
      const result = await orderService.createOrder({
        ...req.body,
        customerId,
      });
      res
        .status(201)
        .json({ success: true, message: "Order created", data: result });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async fetchAdminAllOrder(req, res) {
    try {
      const result = await orderService.fetchAdminAllOrder(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  async getOrderById(req, res) {
    try {
      const result = await orderService.getOrderById(req.params.orderId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  async getOrdersByUser(req, res) {
    const customerId = req.session?.user?.id;

    try {
      const result = await orderService.getOrdersByCustomer(
        req.query,
        customerId
      );
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async updateOrderStatus(req, res) {
    try {
      const result = await orderService.updateOrderStatus(
        req.params.orderId,
        req.body.status
      );
      res
        .status(200)
        .json({ success: true, message: "Status updated", data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async addPayment(req, res) {
    try {
      console.log("body data = ", req.body);
      const result = await orderService.addPayment(
        req.params.orderId,
        req.body
      );
      res
        .status(200)
        .json({ success: true, message: "Payment recorded", data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async getPayments(req, res) {
    try {
      const result = await orderService.getPayments(req.params.orderId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async trackCustomerOrder(req, res) {
    try {
      const result = await orderService.trackCustomerOrder(
        req.params.orderNumber
      );
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async customerOrderCancel(req, res) {
    try {
      const { cancelledReason } = req.body;
      const result = await orderService.customerOrderCancel(
        req.params.orderId,
        cancelledReason
      );
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async customerSingleOrderCancel(req, res) {
    try {
      const { cancelledReason } = req.body;

      const result = await orderService.cancelSingleOrderItem(
        req.params.orderId,
        cancelledReason
      );
      res
        .status(200)
        .json({
          success: true,
          message: "Your Order is Cancelled ",
          data: result,
        });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Order Sales Report
  async orderSalesReport(req, res) {
    try {

      const data = await orderService.getCompleteSalesReportByDate(req.query);
      res.status(200).json({
        success: true,
        message: "fetch Order Report",
        data,
      });
    } catch (error) {
      console.error("Error generating grouped report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate grouped order report",
      });
    }
  },

  // order report
 async orderReport(req, res) {
    try {

      const reportData = await orderService.getOrderReportByStatusFilter(
        req.query
      );

      return res.status(200).json({
        success: true,
        message: "Order Report:",
        data: reportData,
      });
    } catch (error) {
      console.error("Error generating order report:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to generate order report",
      });
    }
  },


  async refundOrder(req, res) {
    try {
      const { orderId } = req.params;
      const { refundAmount, cancelledReason } = req.body;

      if (!refundAmount || refundAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Refund amount must be greater than zero",
        });
      }

      const result = await orderService.adminrefundOrder({ orderId, refundAmount, reason: cancelledReason });
      res.status(200).json({
        success: true,
        message: "Order refunded successfully",
        data: result,
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },



  // admin expected delivery time

    async addExpectedDeliveryTime(req, res) {
    try {
      console.log("mai aa raha hu");
      
      const { id } = req.params;
      const {date}=req.body

      console.log("req.params",req.params);
      console.log("req.body is",req.body);
      

      const result = await orderService.adminExpectedDeliveryTime(id,date);
      res.status(200).json({
        success: true,
        message: "Order Updated successfully",
        data: result,
      });


    } catch (err) {
      console.log(err);
      
      res.status(400).json({ success: false, message: err.message });
    }
  },



  // customer return request 
  async customerReturnRequest(req, res, next) {
    try {
      const { orderId } = req.params;
      const { reason } = req.body;

      // Handle uploaded images
      const files = req.files || [];
      const uploaded = files.length ? await uploadFilesToS3(files) : [];
      const imageUrls = uploaded.map((file) => file.url);

      // Call service
      const refurn = await orderService.customerReturnRequest(orderId, reason, imageUrls);

      res.status(200).json({
        success: true,
        message: "Return request submitted successfully",
        refurn,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  // admin fetch return reqeust
  async fetchReturnRequest(req, res, next) {
    try {

      const result = await orderService.fetchAdminAllReturnRequests(req.query)
      res.status(200).json({ success: true, data: result, message: "All Return Request" });


    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  // admin change staus of return request 
  async adminReturnRequestStatus(req, res, next) {
    try {

      const { id } = req.params

      const {orderId}=req.body
          
      
      if (!orderId || !id) {
     
        
        return res.status(400).json({
          success: false,
          message: "Order Id or Request Id is Required",
        });
      }
      const result = await orderService.adminReturnRequestStatus({ id, orderId })


      return res.status(200).json({
        success: true,
        message: "Return Request Approved",
        data: result
      })


    } catch (error) {
      console.log(error);
      
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },


};

export default orderController;
