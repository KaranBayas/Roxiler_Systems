import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createRating = async (userId, storeId, score, comment = '') => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });

  if (!store) {
    throw new Error('Store not found');
  }

  const existingRating = await prisma.rating.findUnique({
    where: {
      userId_storeId: {
        userId,
        storeId,
      },
    },
  });

  if (existingRating) {
    throw new Error('You have already rated this store');
  }

  const rating = await prisma.rating.create({
    data: {
      score: parseInt(score),
      comment,
      userId,
      storeId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      store: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return rating;
};

export const updateRating = async (ratingId, userId, score, comment = '') => {
  const rating = await prisma.rating.findUnique({
    where: { id: ratingId },
  });

  if (!rating) {
    throw new Error('Rating not found');
  }

  if (rating.userId !== userId) {
    throw new Error('You can only update your own ratings');
  }

  const updated = await prisma.rating.update({
    where: { id: ratingId },
    data: {
      score: parseInt(score),
      comment,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      store: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return updated;
};

export const deleteRating = async (ratingId, userId) => {
  const rating = await prisma.rating.findUnique({
    where: { id: ratingId },
  });

  if (!rating) {
    throw new Error('Rating not found');
  }

  if (rating.userId !== userId) {
    throw new Error('You can only delete your own ratings');
  }

  await prisma.rating.delete({
    where: { id: ratingId },
  });

  return { message: 'Rating deleted successfully' };
};

export const getRatingsByStore = async (storeId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });

  if (!store) {
    throw new Error('Store not found');
  }

  const [ratings, total] = await Promise.all([
    prisma.rating.findMany({
      where: { storeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
    }),
    prisma.rating.count({ where: { storeId } }),
  ]);

  const avgScore = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length).toFixed(2)
    : 0;

  return {
    ratings,
    total,
    averageScore: parseFloat(avgScore),
  };
};

export const getRatingsByUser = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [ratings, total] = await Promise.all([
    prisma.rating.findMany({
      where: { userId },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
    }),
    prisma.rating.count({ where: { userId } }),
  ]);

  return { ratings, total };
};

export const getUserRatingForStore = async (userId, storeId) => {
  const rating = await prisma.rating.findUnique({
    where: {
      userId_storeId: {
        userId,
        storeId,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return rating || null;
};

export const getStoreStats = async (storeId) => {
  const ratings = await prisma.rating.findMany({
    where: { storeId },
  });

  if (ratings.length === 0) {
    return {
      averageRating: 0,
      totalRatings: 0,
      ratingDistribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    };
  }

  const avgRating = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;
  const distribution = {
    5: ratings.filter((r) => r.score === 5).length,
    4: ratings.filter((r) => r.score === 4).length,
    3: ratings.filter((r) => r.score === 3).length,
    2: ratings.filter((r) => r.score === 2).length,
    1: ratings.filter((r) => r.score === 1).length,
  };

  return {
    averageRating: parseFloat(avgRating.toFixed(2)),
    totalRatings: ratings.length,
    ratingDistribution: distribution,
  };
};
