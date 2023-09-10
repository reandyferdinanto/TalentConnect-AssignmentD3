const Programmer = require("../models/programmer");

// Get all programmers
const index = async (req, res) => {
  try {
    const programmers = await Programmer.find();
    res.json(programmers);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get programmer by ID
const show = async (req, res) => {
  try {
    const { id } = req.params;
    const programmer = await Programmer.findById(id);
    if (!programmer) {
      return {
        status: 404,
        error: "Programmer not found",
      };
    }

    return {
      status: 200,
      programmer,
    };
  } catch (error) {
    return {
      status: 500,
      error: error.message,
    };
  }
};

// Create new programmer
const create = async (req, res) => {
  try {
    const { firstName, lastName, age, programmingLanguages } = req.body;
    const programmer = new Programmer({
      firstName,
      lastName,
      age,
      programmingLanguages,
    });
    const savedProgrammer = await programmer.save();
    res.status(201).json(savedProgrammer);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update existing programmer by ID
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, age, programmingLanguages } = req.body;
    const updatedProgrammer = await Programmer.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        age,
        programmingLanguages,
      },
      { new: true }
    );
    if (!updatedProgrammer) {
      return res.status(404).json({ error: "Programmer not found" });
    }
    res.json(updatedProgrammer);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete programmer by ID
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProgrammer = await Programmer.findByIdAndRemove(id);
    if (!deletedProgrammer) {
      return res.status(404).json({ error: "Programmer not found" });
    }
    res.json({ message: "Programmer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  index,
  show,
  create,
  update,
  remove,
};
