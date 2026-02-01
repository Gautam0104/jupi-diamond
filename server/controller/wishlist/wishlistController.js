import wishlistService from "../../services/wishlist/wishlistService.js";

const wishlistController = {
  async addToWishlist(req, res) {
    const customerId = req?.session?.user?.id;
    try {
      const data = await wishlistService.addToWishlist({
        ...req.body,
        customerId: customerId,
      });
      res.status(201).json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getUserWishlist(req, res) {
    try {
      const customerId = req?.session?.user?.id;
      const wishlist = await wishlistService.getUserWishlist(customerId);
      res.json(wishlist);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async removeFromWishlist(req, res) {
    try {
  
      await wishlistService.removeFromWishlist(req.params.id);
      res.json({ message: "Removed from wishlist" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

export default wishlistController;
