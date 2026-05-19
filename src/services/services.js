import API from './api'

// ── AUTH ──────────────────────────────────────────────
export const authService = {
  login:    (email, password) => API.post('/mstuser/login',    { email, password }),
  register: (data)            => API.post('/mstuser/register', data),
  adminLogin:(email, password)=> API.post('/mstadmin/check',   { email, password }),
  getAllUsers: ()              => API.get('/mstuser'),
  getUserById: (id)           => API.get(`/mstuser/${id}`),
}

// ── CATEGORY ──────────────────────────────────────────
export const categoryService = {
  getAll:   ()        => API.get('/category'),
  getById:  (id)      => API.get(`/category/${id}`),
  insert:   (data)    => API.post('/category', data),
  update:   (id, data)=> API.put(`/category/${id}`, data),
  remove:   (id)      => API.delete(`/category/${id}`),
}

// ── BRAND ─────────────────────────────────────────────
export const brandService = {
  getAll:  ()        => API.get('/brand'),
  getById: (id)      => API.get(`/brand/${id}`),
  insert:  (formData)=> API.post('/brand', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:  (id, fd)  => API.put(`/brand/${id}`, fd,  { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove:  (id)      => API.delete(`/brand/${id}`),
}

// ── PRODUCT ───────────────────────────────────────────
export const productService = {
  getAll:  ()        => API.get('/product'),
  getById: (id)      => API.get(`/product/${id}`),
  insert:  (formData)=> API.post('/product', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:  (id, fd)  => API.put(`/product/${id}`, fd,  { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove:  (id)      => API.delete(`/product/${id}`),
}

// ── NUTRITION FACTS ───────────────────────────────────
export const nutritionService = {
  getAll:   ()        => API.get('/nutritionfacts'),
  getById:  (id)      => API.get(`/nutritionfacts/${id}`),
  insert:   (data)    => API.post('/nutritionfacts', data),
  update:   (id, data)=> API.put(`/nutritionfacts/${id}`, data),
  remove:   (id)      => API.delete(`/nutritionfacts/${id}`),
}

// ── ALTERNATIVES (product_alternatives table) ─────────
export const alternativeService = {
  getAll:   ()        => API.get('/alternatives'),
  getById:  (id)      => API.get(`/alternatives/${id}`),
  insert:   (data)    => API.post('/alternatives', data),
  update:   (id, data)=> API.put(`/alternatives/${id}`, data),
  remove:   (id)      => API.delete(`/alternatives/${id}`),
}

// ── HEALTH CATEGORY ───────────────────────────────────
export const healthCategoryService = {
  getAll:   ()        => API.get('/healthcategory'),
  getById:  (id)      => API.get(`/healthcategory/${id}`),
  insert:   (data)    => API.post('/healthcategory', data),
  update:   (id, data)=> API.put(`/healthcategory/${id}`, data),
  remove:   (id)      => API.delete(`/healthcategory/${id}`),
}

// ── HEALTH ITEMS ──────────────────────────────────────
export const healthItemService = {
  getAll:   ()        => API.get('/healthitem'),
  getById:  (id)      => API.get(`/healthitem/${id}`),
  insert:   (data)    => API.post('/healthitem', data),
  update:   (id, data)=> API.put(`/healthitem/${id}`, data),
  remove:   (id)      => API.delete(`/healthitem/${id}`),
}

// ── BMI CATEGORY ──────────────────────────────────────
export const bmiCategoryService = {
  getAll:   ()        => API.get('/bmicategory'),
  getById:  (id)      => API.get(`/bmicategory/${id}`),
  insert:   (data)    => API.post('/bmicategory', data),
  update:   (id, data)=> API.put(`/bmicategory/${id}`, data),
  remove:   (id)      => API.delete(`/bmicategory/${id}`),
}

// ── MEALS ─────────────────────────────────────────────
export const mealService = {
  getAll:   ()        => API.get('/meals'),
  getById:  (id)      => API.get(`/meals/${id}`),
  insert:   (data)    => API.post('/meals', data),
  update:   (id, data)=> API.put(`/meals/${id}`, data),
  remove:   (id)      => API.delete(`/meals/${id}`),
}

// ── MEALS NUTRITION ───────────────────────────────────
export const mealNutritionService = {
  getAll:   ()        => API.get('/mealsnutrition'),
  getById:  (id)      => API.get(`/mealsnutrition/${id}`),
  insert:   (data)    => API.post('/mealsnutrition', data),
  update:   (id, data)=> API.put(`/mealsnutrition/${id}`, data),
  remove:   (id)      => API.delete(`/mealsnutrition/${id}`),
}

// ── MEALS HEALTH RULE ─────────────────────────────────
export const mealHealthRuleService = {
  getAll:   ()        => API.get('/mealshealthrule'),
  getById:  (id)      => API.get(`/mealshealthrule/${id}`),
  insert:   (data)    => API.post('/mealshealthrule', data),
  update:   (id, data)=> API.put(`/mealshealthrule/${id}`, data),
  remove:   (id)      => API.delete(`/mealshealthrule/${id}`),
}

// ── USER HEALTH PROFILE ───────────────────────────────
export const userHealthProfileService = {
  getAll:   ()        => API.get('/userhealthprofile'),
  getById:  (id)      => API.get(`/userhealthprofile/${id}`),
  insert:   (data)    => API.post('/userhealthprofile', data),
  update:   (id, data)=> API.put(`/userhealthprofile/${id}`, data),
  remove:   (id)      => API.delete(`/userhealthprofile/${id}`),
}

// ── USER HEALTH ITEM ──────────────────────────────────
export const userHealthItemService = {
  getAll:   ()        => API.get('/userhealthitem'),
  getById:  (id)      => API.get(`/userhealthitem/${id}`),
  insert:   (data)    => API.post('/userhealthitem', data),
  update:   (id, data)=> API.put(`/userhealthitem/${id}`, data),
  remove:   (id)      => API.delete(`/userhealthitem/${id}`),
}

// ── USER FAVOURITES ───────────────────────────────────
export const userFavouritesService = {
  getAll:   ()        => API.get('/userfavourites'),
  getById:  (id)      => API.get(`/userfavourites/${id}`),
  insert:   (data)    => API.post('/userfavourites', data),
  update:   (id, data)=> API.put(`/userfavourites/${id}`, data),
  remove:   (id)      => API.delete(`/userfavourites/${id}`),
}

// ── USER DAILY LOGS ───────────────────────────────────
export const userDailyLogService = {
  getAll:   ()        => API.get('/userdailylogs'),
  getById:  (id)      => API.get(`/userdailylogs/${id}`),
  insert:   (data)    => API.post('/userdailylogs', data),
  update:   (id, data)=> API.put(`/userdailylogs/${id}`, data),
  remove:   (id)      => API.delete(`/userdailylogs/${id}`),
}

// ── USER MEAL LOG ─────────────────────────────────────
export const userMealLogService = {
  getAll:   ()        => API.get('/usermeallog'),
  getById:  (id)      => API.get(`/usermeallog/${id}`),
  insert:   (data)    => API.post('/usermeallog', data),
  update:   (id, data)=> API.put(`/usermeallog/${id}`, data),
  remove:   (id)      => API.delete(`/usermeallog/${id}`),
}

// ── PRODUCT RATING ────────────────────────────────────
export const productRatingService = {
  getAll:   ()        => API.get('/productrating'),
  getById:  (id)      => API.get(`/productrating/${id}`),
  insert:   (data)    => API.post('/productrating', data),
  update:   (id, data)=> API.put(`/productrating/${id}`, data),
  remove:   (id)      => API.delete(`/productrating/${id}`),
}

// ── RECIPES (product_recipes table) ───────────────────
export const recipeService = {
  getAll:   ()        => API.get('/recipes'),
  getById:  (id)      => API.get(`/recipes/${id}`),
  insert:   (data)    => API.post('/recipes', data),
  update:   (id, data)=> API.put(`/recipes/${id}`, data),
  remove:   (id)      => API.delete(`/recipes/${id}`),
}

// ── RECIPE INGREDIENTS (recipe_ingredients table) ─────
export const recipeIngredientService = {
  getAll:   ()        => API.get('/recipeingredients'),
  getById:  (id)      => API.get(`/recipeingredients/${id}`),
  insert:   (data)    => API.post('/recipeingredients', data),
  update:   (id, data)=> API.put(`/recipeingredients/${id}`, data),
  remove:   (id)      => API.delete(`/recipeingredients/${id}`),
}

// ── RECIPE STEPS (recipe_steps table) ─────────────────
export const recipeStepService = {
  getAll:   ()        => API.get('/recipesteps'),
  getById:  (id)      => API.get(`/recipesteps/${id}`),
  insert:   (data)    => API.post('/recipesteps', data),
  update:   (id, data)=> API.put(`/recipesteps/${id}`, data),
  remove:   (id)      => API.delete(`/recipesteps/${id}`),
}