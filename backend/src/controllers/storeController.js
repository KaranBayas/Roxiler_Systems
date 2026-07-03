import {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  getStoresWithStats,
} from '../services/storeService.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { validateName, validateAddress, validateCity, validateState, validateZipCode } from '../utils/validators.js';

export const listStores = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', order = 'desc' } = req.query;

    const { stores, total } = await getAllStores(
      parseInt(page),
      parseInt(limit),
      search,
      sortBy,
      order
    );

    return paginatedResponse(res, stores, total, page, limit, 'Stores retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, null, 500);
  }
};

export const getStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const store = await getStoreById(parseInt(storeId));
    return successResponse(res, store, 'Store retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, null, error.message.includes('not found') ? 404 : 500);
  }
};

export const addStore = async (req, res) => {
  try {
    const { name, address, city, state, zipCode, description } = req.body;

    const errors = [];
    if (!name || !validateName(name)) errors.push('Valid name is required');
    if (!address || !validateAddress(address)) errors.push('Valid address is required');
    if (!city || !validateCity(city)) errors.push('Valid city is required');
    if (!state || !validateState(state)) errors.push('Valid state is required');
    if (!zipCode || !validateZipCode(zipCode)) errors.push('Valid zip code is required');

    if (errors.length > 0) {
      return errorResponse(res, 'Validation failed', errors, 400);
    }

    const store = await createStore(name, address, city, state, zipCode, description);
    return successResponse(res, store, 'Store created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, null, 500);
  }
};

export const editStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { name, address, city, state, zipCode, description } = req.body;

    if (name && !validateName(name)) {
      return errorResponse(res, 'Valid name is required', null, 400);
    }
    if (address && !validateAddress(address)) {
      return errorResponse(res, 'Valid address is required', null, 400);
    }
    if (city && !validateCity(city)) {
      return errorResponse(res, 'Valid city is required', null, 400);
    }
    if (state && !validateState(state)) {
      return errorResponse(res, 'Valid state is required', null, 400);
    }
    if (zipCode && !validateZipCode(zipCode)) {
      return errorResponse(res, 'Valid zip code is required', null, 400);
    }

    const store = await updateStore(parseInt(storeId), {
      name,
      address,
      city,
      state,
      zipCode,
      description,
    });

    return successResponse(res, store, 'Store updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, null, error.message.includes('not found') ? 404 : 500);
  }
};

export const removeStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const result = await deleteStore(parseInt(storeId));
    return successResponse(res, result, 'Store deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, null, error.message.includes('not found') ? 404 : 500);
  }
};

export const storesStats = async (req, res) => {
  try {
    const stores = await getStoresWithStats();
    return successResponse(res, stores, 'Stores with stats retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, null, 500);
  }
};
