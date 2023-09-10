const { Router } = require("express");
const ProgrammerController = require("./controller/ProgrammerController");

const routes = Router();

routes.get("/programmers", ProgrammerController.index);
routes.get("/programmers/:id", ProgrammerController.show);
routes.post("/programmers", ProgrammerController.create);
routes.put("/programmers/:id", ProgrammerController.update);
routes.delete("/programmers/:id", ProgrammerController.remove);

module.exports = routes;
