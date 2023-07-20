import { duplicateBlock } from "../../../../src/api/services/duplicateBlock";
import {
  allBlocks,
  subblockIdsByParentId,
} from "../../../../src/api/models/Blocks";
import { cleanUpBlocks } from "../utils";
import { assert } from "console";
import * as generateBlockId from "../../../../src/api/services/generateBlockId";

describe("duplicate block", () => {
  beforeEach(() => {
    cleanUpBlocks();
    allBlocks["9673e11e-25d9-4ed3-a3e7-ffcde9b5d812"] = {
      id: "9673e11e-25d9-4ed3-a3e7-ffcde9b5d812",
      content: "root level block",
      parentId: "",
      index: "n",
    };
    allBlocks["9673e11e-25d9-4ed3-a3e7-ffcde9b5d813"] = {
      id: "9673e11e-25d9-4ed3-a3e7-ffcde9b5d813",
      content: "root level block 2",
      parentId: "",
      index: "x",
    };
    allBlocks["9673e11e-25d9-4ed3-a3e7-ffcde9b5d814"] = {
      id: "9673e11e-25d9-4ed3-a3e7-ffcde9b5d814",
      content: "child block",
      parentId: "9673e11e-25d9-4ed3-a3e7-ffcde9b5d813",
      index: "n",
    };
    subblockIdsByParentId["9673e11e-25d9-4ed3-a3e7-ffcde9b5d813"] = [
      "9673e11e-25d9-4ed3-a3e7-ffcde9b5d814",
    ];
  });

  test("duplicate root level block", () => {
    Object.defineProperty(generateBlockId, "generateBlockId", {
      value: jest.fn().mockReturnValue("newblockId"),
    });

    const originalBlockId = "9673e11e-25d9-4ed3-a3e7-ffcde9b5d812";
    duplicateBlock(originalBlockId);
    assert(
      allBlocks["newblockId"].parentId === allBlocks[originalBlockId].parentId
    );
    assert(
      allBlocks["newblockId"].content === allBlocks[originalBlockId].content
    );
    assert(allBlocks["newblockId"].index > allBlocks[originalBlockId].index);
  });

  test("duplicate parent with child", () => {
    Object.defineProperty(generateBlockId, "generateBlockId", {
      value: jest
        .fn()
        .mockReturnValueOnce("newblockId1")
        .mockReturnValueOnce("newblockId2"),
    });

    const originalBlockId = "9673e11e-25d9-4ed3-a3e7-ffcde9b5d813";
    const originalChildId = "9673e11e-25d9-4ed3-a3e7-ffcde9b5d814";
    duplicateBlock(originalBlockId);

    assert(
      allBlocks["newblockId1"].content === allBlocks[originalBlockId].content
    );
    assert(allBlocks["newblockId2"].parentId === "newblockId1");
    assert(
      allBlocks["newblockId2"].content === allBlocks[originalChildId].content
    );
    assert(allBlocks["newblockId2"].index === allBlocks[originalChildId].index);
  });

  test("duplicate missing block", () => {
    expect(() => duplicateBlock("missingId")).toThrowError();
  });
});
