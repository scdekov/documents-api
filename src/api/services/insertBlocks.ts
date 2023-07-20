import {
  Block,
  allBlocks,
  getSubblockIds,
  subblockIdsByParentId,
} from "../models/Blocks";
import { getMiddleIndex } from "./getMiddleIndex";

type BlockToInsert = Omit<Block, "index" | "parentId"> & {
  previousBlockId?: string;
  nextBlockId?: string;
  parentId?: string;
};

export const insertBlocks = (blocks: BlockToInsert[]) => {
  // TODO: check that all ids passed are valid(new block ids are unique and prev/next ids exist and are in the same parent)
  for (let block of blocks) {
    const { previousBlockId, nextBlockId, parentId, ...rest } = block;
    let index = "";
    if (!previousBlockId && !nextBlockId) {
      // make sure we push at the end of the list in case there are existing subblocks
      const lastSiblingBlock = getSubblockIds(parentId || "")
        .map((b) => allBlocks[b])
        .sort((a, b) => a.index.localeCompare(b.index))
        .pop();
      index = getMiddleIndex(lastSiblingBlock?.index || "", "");
    } else {
      const previousBlock = previousBlockId ? allBlocks[previousBlockId] : null;
      const nextBlock = nextBlockId ? allBlocks[nextBlockId] : null;
      index = getMiddleIndex(
        previousBlock?.index || "",
        nextBlock?.index || ""
      );
    }

    allBlocks[rest.id] = { ...rest, index, parentId: parentId || "" };
    subblockIdsByParentId[parentId || ""] = [
      ...getSubblockIds(parentId || ""),
      rest.id,
    ];
  }
};
