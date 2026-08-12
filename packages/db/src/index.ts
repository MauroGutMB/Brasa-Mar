export { db, sql } from "./client";

export {
  adminUsers,
  dishCategories,
  dishes,
  openingHours,
  siteSettings,
} from "./schema";
export type {
  AdminUser,
  BuffetFeature,
  BuffetOccasion,
  Dish,
  DishCategory,
  DishWithCategory,
  NewDish,
  NewDishCategory,
  OpeningHour,
  SiteSettings,
  SiteSettingsUpdate,
} from "./schema";

export {
  SETTINGS_ID,
  getAdminUser,
  getAdminUsers,
  countDishesByCategory,
  getAllDishes,
  getDishBySlug,
  getDishCategories,
  getOpeningHours,
  getSiteSettings,
  getVisibleDishes,
} from "./queries";

export {
  countAdminUsers,
  createAdminUser,
  createDish,
  createDishCategory,
  deleteAdminUser,
  deleteDish,
  deleteDishCategory,
  reorderDishCategories,
  reorderDishes,
  setDishImage,
  setDishVisibility,
  setShowPrices,
  updateBuffet,
  updateContact,
  updateDish,
  updateDishCategory,
  updateIdentity,
  updateLocation,
  updateOpeningHours,
} from "./mutations";
