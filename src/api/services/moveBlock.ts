import {
  allBlocks,
  getSubblockIds,
  subblockIdsByParentId,
} from "../models/Blocks";
import { getMiddleIndex } from "./getMiddleIndex";

export const moveBlock = ({
  id,
  newParentId,
  previousBlockId,
  nextBlockId,
}: {
  id: string;
  newParentId: string;
  previousBlockId: string;
  nextBlockId: string;
}) => {
  // TODO: validate that passed previous/next ids are in the same parent
  const blockToMove = allBlocks[id];
  if (!blockToMove) throw new Error("Block not found");

  if (newParentId !== blockToMove.parentId) {
    subblockIdsByParentId[blockToMove.parentId] = getSubblockIds(
      blockToMove.parentId
    ).filter((b) => b !== id);
    subblockIdsByParentId[newParentId] = [...getSubblockIds(newParentId), id];
  }
  const previousIndex = previousBlockId ? allBlocks[previousBlockId].index : "";
  const nextIndex = nextBlockId ? allBlocks[nextBlockId].index : "";
  allBlocks[id] = {
    ...blockToMove,
    parentId: newParentId,
    index: getMiddleIndex(previousIndex, nextIndex),
  };
};
