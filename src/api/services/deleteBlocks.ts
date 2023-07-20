import {
  allBlocks,
  getSubblockIds,
  subblockIdsByParentId,
} from "../models/Blocks";

export const deleteBlocks = (blockIds: string[]) => {
  for (let blockId of blockIds) {
    if (blockId in allBlocks && allBlocks[blockId].parentId !== null) {
      subblockIdsByParentId[allBlocks[blockId].parentId] = getSubblockIds(
        allBlocks[blockId].parentId
      ).filter((id) => id !== blockId);
    }
    delete allBlocks[blockId];

    deleteBlocks(subblockIdsByParentId[blockId] || []);
  }
};
