import makingWeightServices from "../../services/globalMakingCharges/globalMakingWeightService.js";

const makingWeightController = {
  async createMakingChargeWeightRange(req, res, next) {
    try {
      const result = await makingWeightServices.createMakingChargeWeightRange(
        req.body
      );
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },

  async getAllMakingChargeWeightRanges(req, res, next) {
    try {
      const result = await makingWeightServices.getAllMakingChargeWeightRanges(
        req.query
      );
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
  async getSingleMakingChargeWeightRange(req, res, next) {
    try {
      const result =
        await makingWeightServices.getSingleMakingChargeWeightRange(
          req.params.id
        );
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
  async updateMakingChargeWeightRange(req, res, next) {
    try {
      const result = await makingWeightServices.updateMakingChargeWeightRange(
        req.params.id,
        req.body
      );
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  //update making weight status.....................................
  async updateMakingChargeWeightRangeStatus(req, res, next) {
    try {
      const result =
        await makingWeightServices.updateMakingChargeWeightRangeStatus(
          req.params.id
        );
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async deleteMakingChargeWeightRange(req, res, next) {
    try {
      const result = await makingWeightServices.deleteMakingChargeWeightRange(
        req.params.id
      );
      res.json({
        success: true,
        message: "Deleted successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  //fetch making weight by categoryset id.................
  async fetchMakingWeightByCategoryId(req, res, next) {
    try {
      const result = await makingWeightServices.fetchMakingWeightByCategoryId(
        req.params.categoryId
      );
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};

export default makingWeightController;
