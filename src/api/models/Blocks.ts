export type Block = {
  id: string;
  content: string;
  parentId: string;
  index: string;
};

export const allBlocks: Record<string, Block> = {};
export const subblockIdsByParentId: Record<string, string[]> = {};

export const getSubblockIds = (parentId: string): string[] => {
  return subblockIdsByParentId[parentId] || [];
};
