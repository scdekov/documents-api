import { fetchBlocks } from "./fetchBlocks";

export const exportDocument = () => {
  return JSON.stringify(fetchBlocks(), null, 2);
};
