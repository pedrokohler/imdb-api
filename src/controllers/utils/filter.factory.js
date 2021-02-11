export const createAndFilter = (query) =>
  Object.entries(query).reduce(
    (acc, [key, value]) => {
      const params = [...acc.$and, { [key]: value }];
      return { $and: params };
    },
    { $and: [] }
  );

export default {
  createAndFilter,
};
