const hapi = require("hapi");
const mongoose = require("mongoose");
const Painting = require("./models/Painting");
const { graphqlHapi, graphiqlHapi } = require("apollo-server-hapi");
const schema = require("./graphql/schema");

/* swagger section */
const Inert = require("inert");
const Vision = require("vision");
const HapiSwagger = require("hapi-swagger");
const Pack = require("./package");

const server = hapi.server({
  port: 3000,
  host: "localhost",
});

const urlDb =
  "mongodb+srv://dbuser:1qaz2wsx@cluster0.gcv2c.mongodb.net/paintings?retryWrites=true&w=majority";
mongoose.connect(urlDb, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("open", (err) => {
  if (err) throw err;
  console.log("Connected to database");
});

const init = async () => {
  server.route([
    {
      method: "GET",
      path: "/",
      handler: function (request, reply) {
        return `<h1><a href="/api/v1/paintings">/api/v1/paintings</a></h1>`;
      },
    },
    {
      method: "GET",
      path: "/api/v1/paintings",
      config: {
        description: "Get all the paintings",
        tags: ["api", "v1", "painting"],
      },
      handler: (req, reply) => {
        return Painting.find({});
      },
    },
    {
      method: "POST",
      path: "/api/v1/paintings",
      config: {
        description: "Get a specific painting by ID.",
        tags: ["api", "v1", "painting"],
      },
      handler: (req, reply) => {
        const { name, url, technique } = req.payload;
        try {
          const painting = new Painting({ name, url, technique });
          return painting.save();
        } catch (err) {
          console.log("error", err);
          throw err;
        }
      },
    },
  ]);

  await server.register({
    plugin: graphiqlHapi,
    options: {
      path: "/graphiql",
      graphiqlOptions: {
        endpointURL: "/graphql",
      },
      route: {
        cors: true,
      },
    },
  });

  await server.register({
    plugin: graphqlHapi,
    options: {
      path: "/graphql",
      graphqlOptions: {
        schema,
      },
      route: {
        cors: true,
      },
    },
  });

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: "Paintings API Documentation",
          version: Pack.version,
        },
      },
    },
  ]);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unHandledRejection", (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});

init();
