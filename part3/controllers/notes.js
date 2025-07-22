const notesRouter = require("express").Router();
const { response } = require("express");
const Note = require("../models/note");

// notesRouter.get('/', (request, response) => {
//   response.send('<h1>Hello World</h1>');
// });

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({});
  response.json(notes);
});

notesRouter.get("/:id", async (req, res, next) => {
  const note = await Note.findById(req.params.id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

notesRouter.delete("/:id", async (req, res, next) => {
  await Note.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

// For editing existing notes

notesRouter.put("/:id", (req, res, next) => {
  const { content, important } = req.body;

  Note.findByIdAndUpdate(
    req.params.id,
    { content, important },
    { new: true, runValidator: true, context: "query" }
  )
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((error) => next(error));
});

notesRouter.post("/", async (req, res, next) => {
  const body = req.body;

  if (body.content === undefined) {
    return res.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  const savedNote = await note.save();
  res.status(201).json(savedNote);
});

module.exports = notesRouter;
