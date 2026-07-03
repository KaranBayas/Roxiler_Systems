import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllStores = async (page = 1, limit = 10, search = '', sortBy = 'createdAt', order = 'desc') => {
  const skip = (page - 1) * limit;

  const where = {
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
    ],
  };

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where,
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { [sortBy]: order },
      skip,
      take: parseInt(limit),
    }),
    prisma.store.count({ where }),
  ]);

  return { stores, total };
};

export const getStoreById = async (storeId) => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    include: {
      ratings: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!store) {
    throw new Error('Store not found');
  }

  const avgRating = store.ratings.length > 0
    ? (store.ratings.reduce((sum, r) => sum + r.score, 0) / store.ratings.length).toFixed(2)
    : 0;

  return {
    ...store,
    averageRating: parseFloat(avgRating),
    totalRatings: store.ratings.length,
  };
};

export const createStore = async (name, address, city, state, zipCode, description = '') => {
  const store = await prisma.store.create({
    data: {
      name,
      address,
      city,
      state,
      zipCode,
      description,
    },
    select: {
      id: true,
      name: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      description: true,
      createdAt: true,
    },
  });

  return store;
};

export const updateStore = async (storeId, data) => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });

  if (!store) {
    throw new Error('Store not found');
  }

  const updated = await prisma.store.update({
    where: { id: storeId },
    data: {
      name: data.name || undefined,
      address: data.address || undefined,
      city: data.city || undefined,
      state: data.state || undefined,
      zipCode: data.zipCode || undefined,
      description: data.description || undefined,
    },
    select: {
      id: true,
      name: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updated;
};

export const deleteStore = async (storeId) => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });

  if (!store) {
    throw new Error('Store not found');
  }

  await prisma.store.delete({
    where: { id: storeId },
  });

  return { message: 'Store deleted successfully' };
};

export const getStoresWithStats = async () => {
  const stores = await prisma.store.findMany({
    include: {
      ratings: true,
    },
  });

  return stores.map((store) => ({
    ...store,
    averageRating: store.ratings.length > 0
      ? (store.ratings.reduce((sum, r) => sum + r.score, 0) / store.ratings.length).toFixed(2)
      : 0,
    totalRatings: store.ratings.length,
  }));
};
