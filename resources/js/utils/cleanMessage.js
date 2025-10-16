export const cleanMessage = (msg) => {
  if (!msg || typeof msg !== "string") return msg;
  return msg.replace(/"/g, "");
};