export const validateHasExtraInputs = (allowedFields) => (payload) => {
  const hasExtraField = Object.keys(payload).some(
    (field) => !allowedFields.includes(field)
  );

  if (hasExtraField) {
    return { error: 400 };
  }
  return {};
};

export const validateIsMissingFields = (requiredFields) => (payload) => {
  const isRequiredFieldMissing = requiredFields.some(
    (field) => !Object.keys(payload).includes(field)
  );

  if (isRequiredFieldMissing) {
    return { error: 400 };
  }
  return {};
};

export default {
  validateHasExtraInputs,
  validateIsMissingFields,
};
