import { Router } from "express";
import publicController from "../../controller/indexPagePublicAPI/publicController.js";
import contact from "../../controller/contact-form/contactController.js";

const router = Router();

// public api index page......................................................
router.get("/data", publicController.fetchIndexPageData);
router.post("/contact/create", contact.submitContactForm);

//product page data filter jewellery type, style, shape, gold color, shape diamond color...................
router.get("/side-filter", publicController.fetchFilterData);
router.get('/product-styles/:jewelryTypeSlug', publicController.fetchProductStylesByJewelryType);
export default router;
