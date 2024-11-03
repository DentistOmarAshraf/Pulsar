import merchantClient from "../storage/merchantClient.js";

export default class MerchantController {
  static async postMerchant(req, res) {
    const { id } = req.userData;
    const { name, address } = req.body;
    try {
      const merchant = await merchantClient.addMerchantByUserId(
        id,
        name,
        address
      );
      res.status(201).json(merchant);
    } catch (error) {
      console.log(error);
      if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.details });
      }
      const statusCode = error.status || 500;
      return res.status(statusCode).json({ error: error.message });
    }
  }

  static async getMerchants(req, res) {
    const { id } = req.userData;
    const { page, size } = req.query;
    try {
      const allMerhcants = await merchantClient.getAllMerchantByUserId(
        id,
        page,
        size
      );
      return res.status(200).json(allMerhcants);
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  }

  static async getOneMerchant(req, res) {
    const { id } = req.userData;
    const merchantId = req.params.id;
    try {
      const merchant = await merchantClient.getMerchantByUserId(id, merchantId);
      return res.status(200).json(merchant);
    } catch (error) {
      const statuscode = error.status || 500;
      return res.status(statuscode).json({ error: error.message });
    }
  }

  static async deleteMerchant(req, res) {
    const { id } = req.userData;
    const merchant = req.params.id;
    try {
      const deleted = await merchantClient.deleteMerchantByUserId(id, merchant);
      return res.status(200).json({ deleted: "Ok" });
    } catch (error) {
      const statusCode = error.status || 500;
      return res.status(statusCode).json({ error: error.message });
    }
  }

  static async updateMerchant(req, res) {
    const { id } = req.userData;
    const merchant = req.params.id;
    const { name, address, isActive } = req.body;
    try {
      const updated = await merchantClient.updateMerchantByUserId(
        id,
        merchant,
        { name, address, isActive }
      );
      return res.status(201).json(updated);
    } catch (error) {
      const statusCode = error.status;
      return res.status(statusCode).json(error.message);
    }
  }
}
