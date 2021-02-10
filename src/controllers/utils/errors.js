const errorMap = new Map([
  [409, { error: "Document already exists" }],
  [400, { error: "Bad request" }],
]);

export default errorMap;
