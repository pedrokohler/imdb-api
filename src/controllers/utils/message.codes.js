const messageCodeMap = new Map([
  [409, { error: "Document already exists" }],
  [400, { error: "Bad request" }],
  [404, { error: "Document not found" }],
  [200, { success: true }],
]);

export default messageCodeMap;
