import { deleteBlocks } from "../../../../src/api/services/deleteBlocks";
import {
  allBlocks,
  subblockIdsByParentId,
} from "../../../../src/api/models/Blocks";
import { cleanUpBlocks } from "../utils";

describe("delete blocks", () => {
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
      content: "root level block",
      parentId: "",
      index: "x",
    };
    allBlocks["9673e11e-25d9-4ed3-a3e7-ffcde9b5d814"] = {
      id: "9673e11e-25d9-4ed3-a3e7-ffcde9b5d814",
      content: "nested block",
      parentId: "9673e11e-25d9-4ed3-a3e7-ffcde9b5d812",
      index: "n",
    };

    subblockIdsByParentId[""] = [
      "9673e11e-25d9-4ed3-a3e7-ffcde9b5d812",
      "9673e11e-25d9-4ed3-a3e7-ffcde9b5d813",
    ];
    subblockIdsByParentId["9673e11e-25d9-4ed3-a3e7-ffcde9b5d812"] = [
      "9673e11e-25d9-4ed3-a3e7-ffcde9b5d814",
    ];
  });

  test("delete root level block", () => {
    deleteBlocks(["9673e11e-25d9-4ed3-a3e7-ffcde9b5d812"]);

    expect(allBlocks).not.toHaveProperty(
      "9673e11e-25d9-4ed3-a3e7-ffcde9b5d812"
    );
    expect(subblockIdsByParentId[""]).not.toContain(
      "9673e11e-25d9-4ed3-a3e7-ffcde9b5d812"
    );
  });

  test("delete nested block", () => {
    deleteBlocks(["9673e11e-25d9-4ed3-a3e7-ffcde9b5d814"]);
    expect(allBlocks).not.toHaveProperty(
      "9673e11e-25d9-4ed3-a3e7-ffcde9b5d814"
    );
    expect(
      subblockIdsByParentId["9673e11e-25d9-4ed3-a3e7-ffcde9b5d812"]
    ).not.toContain("9673e11e-25d9-4ed3-a3e7-ffcde9b5d814");
  });

  test("delete root with nested blocks", () => {
    deleteBlocks(["9673e11e-25d9-4ed3-a3e7-ffcde9b5d812"]);
    expect(allBlocks).not.toHaveProperty(
      "9673e11e-25d9-4ed3-a3e7-ffcde9b5d814"
    );
  });

  test("try to delete missing block", () => {
    deleteBlocks(["9673e11e-25d9-4ed3-a3e7-ffcde9b5d815"]);
  });
});
