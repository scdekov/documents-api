import { Block, allBlocks, getSubblockIds } from "../models/Blocks";

type BlockWithSubblocks = Block & {
  subblocks: BlockWithSubblocks[];
};
export const fetchBlocks = (blockIds?: string[]): BlockWithSubblocks[] => {
  if (!blockIds) {
    return Object.values(allBlocks)
      .filter((block) => block.parentId === "")
      .sort((a, b) => a.index.localeCompare(b.index))
      .map((block) => {
        return {
          ...block,
          subblocks: fetchBlocks(getSubblockIds(block.id)),
        };
      });
  }

  return blockIds
    .sort((a, b) => {
      return allBlocks[a].index.localeCompare(allBlocks[b].index);
    })
    .map((id) => {
      return {
        ...allBlocks[id],
        subblocks: fetchBlocks(getSubblockIds(id)),
      };
    });
};
