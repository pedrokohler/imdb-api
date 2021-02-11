export const createAndFilter = (query) =>
  Object.entries(query).reduce((acc, [key, value]) => {
    const { $and } = acc;
    const obj = { [key]: value };
    if ($and) {
      const params = [...$and, obj];
      return { $and: params };
    }
    return { $and: [obj] };
  }, {});

export default {
  createAndFilter,
};
