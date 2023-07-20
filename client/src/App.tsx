import React, { useEffect, useState, useRef, FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import { BlockItem, Block } from "./Block";
import { Dialog } from "./Dialog";

const API_URL = "http://localhost:3004";

function App() {
  const [newBlockContent, setNewBlockContent] = useState("");
  const newBlockRef = useRef<HTMLInputElement>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportString, setExportString] = useState("");

  const fetchBlocks = async () => {
    try {
      const resp = await fetch(`${API_URL}/blocks/`);
      setBlocks(await resp.json());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const insertBlock = async ({
    content,
    parentId,
  }: {
    content: string;
    parentId?: string;
  }) => {
    if (!content) return;
    try {
      await fetch(`${API_URL}/blocks/bulk/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            id: uuidv4(),
            content: content,
            parentId: parentId,
          },
        ]),
      });
      await fetchBlocks();
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await insertBlock({ content: newBlockContent });
    setNewBlockContent("");
    newBlockRef.current?.focus();
  };

  const moveItem = async ({
    blockId,
    newParentId,
    previousBlockId,
    nextBlockId,
  }: {
    blockId: string;
    newParentId: string;
    previousBlockId: string;
    nextBlockId: string;
  }) => {
    try {
      await fetch(`${API_URL}/blocks/${blockId}/move/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newParentId, previousBlockId, nextBlockId }),
      });
      await fetchBlocks();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBlock = async (id: string) => {
    try {
      await fetch(`${API_URL}/blocks/${id}/`, {
        method: "DELETE",
      });
      await fetchBlocks();
    } catch (err) {
      console.log(err);
    }
  };

  const dupliacateBlock = async (id: string) => {
    try {
      await fetch(`${API_URL}/blocks/${id}/duplicate/`, {
        method: "POST",
      });
      await fetchBlocks();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchExport = async () => {
    try {
      const resp = await fetch(`${API_URL}/documents/export/`);
      const json = await resp.json();
      setExportString(json);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <div style={{ textAlign: "right", marginRight: 10 }}>
        <button
          onClick={async () => {
            fetchExport();
            setExportModalVisible(true);
          }}
        >
          export
        </button>
      </div>
      <Dialog open={exportModalVisible}>
        <button
          style={{
            marginRight: 10,
          }}
          onClick={() => {
            const url = window.URL.createObjectURL(new Blob([exportString]));
            const a = document.createElement("a");
            a.href = url;
            a.download = "blocks.json";
            a.click();
          }}
        >
          download
        </button>
        <button onClick={() => setExportModalVisible(false)}>close</button>
        <p
          style={{
            whiteSpace: "pre-wrap",
          }}
        >
          {exportString}
        </p>
      </Dialog>
      <div>
        {blocks.map((block, ix) => (
          <BlockItem
            block={block}
            insertBlock={insertBlock}
            moveDown={
              ix < blocks.length - 1
                ? () =>
                    moveItem({
                      blockId: block.id,
                      newParentId: block.parentId || "",
                      previousBlockId: blocks[ix + 1]?.id || "",
                      nextBlockId: blocks[ix + 2]?.id || "",
                    })
                : undefined
            }
            moveUp={
              ix > 0
                ? () =>
                    moveItem({
                      blockId: block.id,
                      newParentId: block.parentId || "",
                      previousBlockId: blocks[ix - 2]?.id || "",
                      nextBlockId: blocks[ix - 1]?.id || "",
                    })
                : undefined
            }
            moveDownRight={
              blocks[ix + 1]
                ? () =>
                    moveItem({
                      blockId: block.id,
                      newParentId: blocks[ix + 1]?.id || "",
                      previousBlockId: "",
                      nextBlockId: blocks[ix + 1].subblocks[0]?.id || "",
                    })
                : undefined
            }
            moveItem={moveItem}
            nextBlockId={blocks[ix + 1]?.id || ""}
            deleteBlock={deleteBlock}
            duplicateBlock={dupliacateBlock}
          />
        ))}
      </div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Enter some text..."
          value={newBlockContent}
          onChange={(e) => setNewBlockContent(e.target.value)}
          ref={newBlockRef}
          style={{
            margin: 10,
          }}
        />
      </form>
    </div>
  );
}

export default App;
