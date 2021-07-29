import messageCodeMap from "./message.codes";

export const createErrorResponse = (res, status) =>
  res.status(status).json(messageCodeMap.get(status));

export default {
  createErrorResponse,
};
