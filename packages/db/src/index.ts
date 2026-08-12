export { db, sql } from "./client";

export {
  adminUsers,
  dishTagEnum,
  dishes,
  openingHours,
  siteSettings,
} from "./schema";
export type {
  AdminUser,
  BuffetFeature,
  BuffetOccasion,
  Dish,
  DishTag,
  NewDish,
  OpeningHour,
  SiteSettings,
  SiteSettingsUpdate,
} from "./schema";

export {
  SETTINGS_ID,
  getAdminUser,
  getAdminUsers,
  getAllDishes,
  getDishBySlug,
  getOpeningHours,
  getSiteSettings,
  getVisibleDishes,
} from "./queries";

export {
  countAdminUsers,
  createAdminUser,
  createDish,
  deleteAdminUser,
  deleteDish,
  reorderDishes,
  setDishImage,
  setDishVisibility,
  setShowPrices,
  updateBuffet,
  updateContact,
  updateDish,
  updateIdentity,
  updateLocation,
  updateOpeningHours,
} from "./mutations";
