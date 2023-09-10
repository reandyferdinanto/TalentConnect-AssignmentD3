// const request = require("supertest");
// const mongoose = require("mongoose");
// const { MongoMemoryServer } = require("mongodb-memory-server");
// const app = require("../../src/app/app");

// // Import the Programmer model
// const Programmer = require("../../src/app/models/programmer");

// describe("Programmer Controller", () => {
//   let mongoServer;

//   beforeAll(async () => {
//     mongoServer = await MongoMemoryServer.create();
//     const mongoUri = mongoServer.getUri();
//     await mongoose.connect(mongoUri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     mongoose.model("MyModel").createIndex({ name: 1 });
//   });

//   afterAll(async () => {
//     await mongoose.disconnect();
//     await mongoServer.stop();
//   });

//   afterEach(async () => {
//     const collections = await mongoose.connection.db.programmer();
//     for (let collection of collections) {
//       await collection.deleteMany({});
//     }
//   });

//   it("should create a new programmer", async () => {
//     const response = await request(app)
//       .post("/programmers")
//       .send({
//         firstName: "John",
//         lastName: "Doe",
//         age: 30,
//         programmingLanguages: ["JavaScript", "Python"],
//       });

//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty("_id");
//   });

//   it("should get all programmers", async () => {
//     const programmer1 = new Programmer({
//       firstName: "John",
//       lastName: "Doe",
//       age: 30,
//       programmingLanguages: ["JavaScript", "Python"],
//     });

//     const programmer2 = new Programmer({
//       firstName: "Alice",
//       lastName: "Smith",
//       age: 25,
//       programmingLanguages: ["Java", "C++"],
//     });

//     await programmer1.save();
//     await programmer2.save();

//     const response = await request(app).get("/programmers");

//     expect(response.status).toBe(200);
//     expect(response.body.length).toBe(2);
//   });

//   it("should update an existing programmer", async () => {
//     const programmer = new Programmer({
//       firstName: "John",
//       lastName: "Doe",
//       age: 30,
//       programmingLanguages: ["JavaScript", "Python"],
//     });

//     await programmer.save();

//     const updatedData = {
//       firstName: "UpdatedFirstName",
//       lastName: "UpdatedLastName",
//       age: 35,
//       programmingLanguages: ["Java", "C"],
//     };

//     const response = await request(app)
//       .put(`/programmers/${programmer._id}`)
//       .send(updatedData);

//     expect(response.status).toBe(200);
//     expect(response.body).toMatchObject(updatedData);
//   });

//   it("should get a programmer by ID", async () => {
//     const programmer = new Programmer({
//       firstName: "John",
//       lastName: "Doe",
//       age: 30,
//       programmingLanguages: ["JavaScript", "Python"],
//     });

//     await programmer.save();

//     const response = await request(app).get(`/programmers/${programmer._id}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty("_id", programmer._id.toString());
//   });

//   it("should return a 404 error when getting a non-existent programmer by ID", async () => {
//     const nonExistentId = "nonexistentid";

//     const response = await request(app).get(`/programmers/${nonExistentId}`);

//     expect(response.status).toBe(404);
//     expect(response.body).toMatchObject({ error: "Programmer not found" });
//   });

//   it("should delete a programmer by ID", async () => {
//     const programmer = new Programmer({
//       firstName: "John",
//       lastName: "Doe",
//       age: 30,
//       programmingLanguages: ["JavaScript", "Python"],
//     });

//     await programmer.save();

//     const response = await request(app).delete(
//       `/programmers/${programmer._id}`
//     );

//     expect(response.status).toBe(200);
//     expect(response.body).toMatchObject({
//       message: "Programmer deleted successfully",
//     });

//     // Verify that the programmer has been deleted
//     const deletedProgrammer = await Programmer.findById(programmer._id);
//     expect(deletedProgrammer).toBeNull();
//   });

//   it("should return a 404 error when deleting a non-existent programmer by ID", async () => {
//     const nonExistentId = "nonexistentid";

//     const response = await request(app).delete(`/programmers/${nonExistentId}`);

//     expect(response.status).toBe(404);
//     expect(response.body).toMatchObject({ error: "Programmer not found" });
//   });
// });

const request = require("supertest");
const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Types;
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../src/app/app");

// Import the Programmer model
const Programmer = require("../../src/app/models/programmer");

describe("Programmer Controller", () => {
  let mongoServer;
  let objectId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Import the Programmer model
    await require("../../src/app/models/programmer");
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Delete all programmers from the database
    await Programmer.deleteMany({});
  });

  beforeEach(async () => {
    // Insert a programmer with an ObjectId for the _id field
    const objectId = new mongoose.Types.ObjectId();
    await Programmer.create({
      _id: objectId,
      firstName: "John",
      lastName: "Doe",
      age: 30,
      error: null,
    });
  });

  it("should get all programmers", async () => {
    const response = await request(app).get("/programmers");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it("should get programmer by ID", async () => {
    const response = await request(app).get("/programmers/1");

    const status = await response.status;
    const body = await response.body;

    expect(status).toBe(200);
    // expect(body).toEqual({
    //   _id: objectId,
    //   firstName: "John",
    //   lastName: "Doe",
    //   error: null,
    // });
  }, 10000);

  it("should create new programmer", async () => {
    const response = await request(app)
      .post("/programmers")
      .send({
        firstName: "John",
        lastName: "Doe",
        age: 30,
        programmingLanguages: ["JavaScript", "Python"],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("firstName");
    expect(response.body).toHaveProperty("lastName");
    expect(response.body).toHaveProperty("age");
    expect(response.body).toHaveProperty("programmingLanguages");
  });

  it("should update existing programmer by ID", async () => {
    const programmer = {
      firstName: "John",
      lastName: "Doe",
      age: 30,
      programmingLanguages: ["JavaScript", "Python"],
    };
    await Programmer.create(programmer);

    const updatedProgrammer = {
      firstName: "Jane",
      lastName: "Doe",
      age: 31,
      programmingLanguages: ["Java", "C++"],
    };

    const response = await request(app)
      .put("/programmers/1")
      .send(updatedProgrammer);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedProgrammer);
  });

  it("should delete programmer by ID", async () => {
    const programmer = {
      firstName: "John",
      lastName: "Doe",
      age: 30,
      programmingLanguages: ["JavaScript", "Python"],
    };
    await Programmer.create(programmer);

    const response = await request(app).delete("/programmers/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Programmer deleted successfully",
    });
  });
});
