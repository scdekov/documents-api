import { useState, useRef } from "react";

export type Block = {
  id: string;
  content: string;
  parentId: string;
  subblocks: Block[];
};

export const BlockItem = ({
  block,
  insertBlock,
  moveDown,
  moveUp,
  moveItem,
  moveDownRight,
  moveLeft,
  nextBlockId,
  deleteBlock,
  duplicateBlock,
}: {
  block: Block;
  insertBlock: ({
    content,
    parentId,
  }: {
    content: string;
    parentId: string;
  }) => void;
  moveDown?: () => void;
  moveUp?: () => void;
  moveDownRight?: () => void;
  moveLeft?: () => void;
  moveItem: ({
    blockId,
    newParentId,
    previousBlockId,
    nextBlockId,
  }: {
    blockId: string;
    newParentId: string;
    previousBlockId: string;
    nextBlockId: string;
  }) => void;
  nextBlockId: string;
  deleteBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
}) => {
  const [newBlockContent, setNewBlockContent] = useState("");
  const newBlockRef = useRef<HTMLInputElement>(null);

  return (
    <div
      style={{
        border: "1px solid #9f9f9f47",
        margin: 10,
        padding: 10,
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ marginBottom: 10 }}>
            {moveLeft && (
              <button onClick={moveLeft} style={{ marginRight: 5 }}>
                &#8592;
              </button>
            )}
            {moveUp && (
              <button onClick={moveUp} style={{ marginRight: 5 }}>
                &#8593;
              </button>
            )}
            {moveDown && (
              <button onClick={moveDown} style={{ marginRight: 5 }}>
                &#8595;
              </button>
            )}
            {moveDownRight && (
              <button onClick={moveDownRight} style={{ marginRight: 5 }}>
                &#8628;
              </button>
            )}
          </div>
          <div>
            <button
              onClick={() => duplicateBlock(block.id)}
              style={{
                marginRight: 5,
              }}
            >
              &#9112;
            </button>
            <button
              onClick={() => deleteBlock(block.id)}
              style={{ marginRight: 5 }}
            >
              &#128465;
            </button>
          </div>
        </div>
        {block.content}
      </div>
      <div
        style={{
          paddingLeft: 20,
        }}
      >
        {block.subblocks.map((subblock, ix) => (
          <BlockItem
            block={subblock}
            insertBlock={insertBlock}
            moveItem={moveItem}
            moveDown={
              ix < block.subblocks.length - 1
                ? () =>
                    moveItem({
                      blockId: subblock.id,
                      newParentId: subblock.parentId || "",
                      previousBlockId: block.subblocks[ix + 1]?.id || "",
                      nextBlockId: block.subblocks[ix + 2]?.id || "",
                    })
                : undefined
            }
            moveUp={
              ix > 0
                ? () =>
                    moveItem({
                      blockId: subblock.id,
                      newParentId: subblock.parentId || "",
                      previousBlockId: block.subblocks[ix - 2]?.id || "",
                      nextBlockId: block.subblocks[ix - 1]?.id || "",
                    })
                : undefined
            }
            moveDownRight={
              ix < block.subblocks.length - 1
                ? () =>
                    moveItem({
                      blockId: subblock.id,
                      newParentId: block.subblocks[ix + 1]?.id || "",
                      previousBlockId: "",
                      nextBlockId:
                        block.subblocks[ix + 1].subblocks[0]?.id || "",
                    })
                : undefined
            }
            moveLeft={() =>
              moveItem({
                blockId: subblock.id,
                newParentId: block.parentId || "",
                previousBlockId: block.id || "",
                nextBlockId: nextBlockId || "",
              })
            }
            nextBlockId={block.subblocks[ix + 1]?.id || ""}
            deleteBlock={deleteBlock}
            duplicateBlock={duplicateBlock}
          />
        ))}
      </div>
      <div
        style={{
          paddingLeft: 20,
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            insertBlock({ content: newBlockContent, parentId: block.id });
            setNewBlockContent("");
            newBlockRef.current?.focus();
          }}
        >
          <input
            type="text"
            style={{
              marginTop: 10,
              marginRight: 10,
            }}
            placeholder="Enter some text..."
            value={newBlockContent}
            onChange={(e) => setNewBlockContent(e.target.value)}
            ref={newBlockRef}
          />
        </form>
      </div>
    </div>
  );
};
