const hapi = require("hapi");
const mongoose = require("mongoose");
const urlDb =
  "mongodb+srv://dbuser:1qaz2wsx@cluster0.gcv2c.mongodb.net/paintings?retryWrites=true&w=majority";
const Painting = require("./models/Painting");
mongoose.connect(urlDb, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("open", (err) => {
  if (err) throw err;
  console.log("Connected to database");
});

const server = hapi.server({
  port: 3000,
  host: "localhost",
});

const init = async () => {
  server.route([
    {
      method: "GET",
      path: "/",
      handler: function (request, reply) {
        return `<h1>/api/v1/paintings</h1>`;
      },
    },
    {
      method: "GET",
      path: "/api/v1/paintings",
      handler: (req, reply) => {
        return Painting.find({});
      },
    },
    {
      method: "POST",
      path: "/api/v1/paintings",
      handler: (req, reply) => {
        const { name, url, techniques } = req.payload;
        try {
          const painting = new Painting({ name, url, techniques });
          return painting.save();
        } catch (err) {
          console.log("error", err);
          throw err;
        }
      },
    },
  ]);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();
