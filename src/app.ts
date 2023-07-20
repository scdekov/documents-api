import express from "express";
import { fetchBlocks } from "./api/services/fetchBlocks";
import { insertBlocks } from "./api/services/insertBlocks";
import Joi from "joi";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import { moveBlock } from "./api/services/moveBlock";
import { deleteBlocks } from "./api/services/deleteBlocks";
import { duplicateBlock } from "./api/services/duplicateBlock";
import { exportDocument } from "./api/services/exportDocument";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/blocks/", (req, res) => {
  return res.json(fetchBlocks());
});

const bulkInsertSchema = Joi.array().items(
  Joi.object().keys({
    id: Joi.string().required(),
    content: Joi.string().required(),
    parentId: Joi.string(),
    previousBlockId: Joi.string(),
    nextBlockId: Joi.string(),
  })
);
app.post("/blocks/bulk/", (req, res) => {
  const { value, error } = bulkInsertSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  insertBlocks(value);
  res.status(201).send();
});

const moveBlockSchema = Joi.object().keys({
  id: Joi.string().required(),
  newParentId: Joi.string().allow(""),
  previousBlockId: Joi.string().allow(""),
  nextBlockId: Joi.string().allow(""),
});

app.post("/blocks/:id/move/", (req, res) => {
  const { value, error } = moveBlockSchema.validate({
    ...req.body,
    id: req.params.id,
  });
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  moveBlock(value);
  res.status(201).send();
});

app.post("/blocks/:id/duplicate/", (req, res) => {
  const { id } = req.params;
  const block = fetchBlocks([id])[0];
  if (!block) {
    return res.status(404).json({ message: "Block not found" });
  }
  duplicateBlock(id);
  res.status(201).send();
});

app.delete("/blocks/:id/", (req, res) => {
  const { id } = req.params;
  deleteBlocks([id]);
  res.status(204).send();
});

app.get("/documents/export/", (req, res) => {
  res.json(exportDocument()).send();
});

app.listen(3004, () => {
  console.log("Example app listening on port 3000!");
});
