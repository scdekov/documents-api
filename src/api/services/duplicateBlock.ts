import {
  Block,
  allBlocks,
  getSubblockIds,
  subblockIdsByParentId,
} from "../models/Blocks";
import { generateBlockId } from "./generateBlockId";
import { getMiddleIndex } from "./getMiddleIndex";

export const duplicateBlock = (blockId: string) => {
  const blockToDuplicate = allBlocks[blockId];
  if (!blockToDuplicate) throw new Error("Block not found");

  const sortedSiblingBlocks = Object.values(allBlocks)
    .filter((block) => block.parentId === blockToDuplicate.parentId)
    .sort((a, b) => a.index.localeCompare(b.index));

  const nextBlockIndex =
    sortedSiblingBlocks.find((block) => block.index > blockToDuplicate.index)
      ?.index || "";

  const subblocksToDuplicate = Object.values(allBlocks).filter(
    (b) => b.parentId === blockToDuplicate.id
  );

  const newBlockId = generateBlockId();
  allBlocks[newBlockId] = {
    id: newBlockId,
    parentId: blockToDuplicate.parentId,
    content: blockToDuplicate.content,
    index: getMiddleIndex(blockToDuplicate.index, nextBlockIndex),
  };
  subblockIdsByParentId[blockToDuplicate.parentId] = [
    ...getSubblockIds(blockToDuplicate.parentId),
    newBlockId,
  ];

  const subBlocks = _duplicateSubblocks(subblocksToDuplicate, newBlockId);
  for (let subBlock of subBlocks) {
    allBlocks[subBlock.id] = subBlock;
    subblockIdsByParentId[subBlock.parentId] = [
      ...getSubblockIds(subBlock.parentId),
      subBlock.id,
    ];
  }
};

const _duplicateSubblocks = (
  blocks: Block[],
  parentBlockId: string
): Block[] => {
  return blocks.flatMap((block) => {
    const newBlockId = generateBlockId();
    return [
      {
        id: newBlockId,
        parentId: parentBlockId,
        content: block.content,
        index: block.index,
      },
      ..._duplicateSubblocks(
        getSubblockIds(block.id).map((id) => allBlocks[id]),
        newBlockId
      ),
    ];
  });
};
