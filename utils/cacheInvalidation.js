export const clearProjectUserCache = async (projectId) => {
  const pattern = `users:${projectId}:*`;

  const keys = await redisClient.keys(pattern);

  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};
