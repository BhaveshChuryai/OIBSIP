/**
 * Pizza API helpers
 */
import API from './axios';

export const getIngredients = () => API.get('/pizza/ingredients');
export const getMenu = () => API.get('/pizza/menu');
