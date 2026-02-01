import axios from "axios";

const delhiveryService = {
  async createPickupLocation(data) {
    return axios.post(
      `${process.env.DELHIVERY_BASE_URL}/fm/request/new/`,
      data,
      {
        headers: { Authorization: `Token ${process.env.DELHIVERY_TOKEN}` },
      }
    );
  },

  async createOrder(data) {
    return axios.post(
      `${process.env.DELHIVERY_BASE_URL}/api/cmu/create.json`,
      data,
      {
        headers: { Authorization: `Token ${process.env.DELHIVERY_TOKEN}` },
      }
    );
  },

  async trackOrder(awb) {
    return axios.get(
      `${process.env.DELHIVERY_BASE_URL}/api/v1/packages/json/?waybill=${awb}`,
      {
        headers: { Authorization: `Token ${process.env.DELHIVERY_TOKEN}` },
      }
    );
  },

  async cancelOrder(waybill) {
    return axios.post(
      `${process.env.DELHIVERY_BASE_URL}/api/p/edit`,
      { waybill, status: "Cancelled" },
      {
        headers: { Authorization: `Token ${process.env.DELHIVERY_TOKEN}` },
      }
    );
  },

  async getManifest(date) {
    return axios.get(
      `${process.env.DELHIVERY_BASE_URL}/api/p/manifest?date=${date}`,
      {
        headers: { Authorization: `Token ${process.env.DELHIVERY_TOKEN}` },
      }
    );
  },

  async generateWaybill(count) {
    return axios.get(
      `${process.env.DELHIVERY_BASE_URL}/waybill/api/json/?count=${count}`,
      {
        headers: { Authorization: `Token ${process.env.DELHIVERY_TOKEN}` },
      }
    );
  },
};

export default delhiveryService;
