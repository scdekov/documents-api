import {
  allBlocks,
  subblockIdsByParentId,
} from "../../../src/api/models/Blocks";

export const cleanUpBlocks = () => {
  for (let id of Object.keys(allBlocks)) {
    delete allBlocks[id];
  }
  for (let id of Object.keys(subblockIdsByParentId)) {
    delete subblockIdsByParentId[id];
  }
};
