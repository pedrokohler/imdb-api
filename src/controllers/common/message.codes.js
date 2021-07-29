const messageCodeMap = new Map([
  [200, { success: true }],
  [400, { error: "Bad request" }],
  [401, { error: "Unauthorized" }],
  [404, { error: "Document not found" }],
  [409, { error: "Document already exists" }],
]);

export default messageCodeMap;
