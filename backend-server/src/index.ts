import {serve} from "@hono/node-server";
import {Hono} from "hono";
import {prettyJSON} from "hono/pretty-json";
import {secureHeaders} from "hono/secure-headers";
import {logger} from "hono/logger";
import {serveStatic} from "@hono/node-server/serve-static";
import {cors} from "hono/cors";
import {Server} from "socket.io";
import {Server as HttpServer} from "http";
import {routes} from "./routes/routes";
import "dotenv/config";

//"strict: false" means that "api/" and "api" will reach the same end-point
const app = new Hono({strict: false});

/* Pretty JSON middleware enables "JSON pretty print" for JSON response body. 
  Adding 
  "?pretty"
  to url query param, the JSON strings are prettified. */
//ex. GET /?pretty
app.use(prettyJSON());
//like "helmet".
//conflicts with poweredBy() middleware (adds a header: "X-Powered-By": "Hono").
//But I frankly don't care
app.use(secureHeaders());
//logger
app.use("*", logger());

//enable cors if we are not in production mode
// app.use(
//   "*",
//   cors({ origin: process.env.DEV_OR_PRODUCTION === "production" ? "*" : "" })
// );

// app.use(cors({ origin: "*" }));
app.use("*", cors());
//! Is the cors setting needed? It seems to work without CORS.. does this work?! if so, add it to the notebook

app.route("/", routes); // Handle routes

//setting a static (public) directory
app.use("/public/*", serveStatic({root: "./"}));

//setting up the server listener to the port
const port = 5000;

const server = serve(
    {
        fetch: app.fetch,
        port,
    },
    (info) => {
        console.log(`Server is running on: http://${info.address}:${info.port}`);
    }
);


//websocket
//http://192.168.1.116:5000/ws/
const io = new Server(server as HttpServer, {
    path: "/ws/",
    serveClient: true,
    cors: {
        origin: process.env.DEV_OR_PRODUCTION === "production" ? false : "*",
    },
});
io.on("error", (err) => console.log("error: ", err));
io.on("connection", (socket) => {
    console.log(
        `client connected! id: ${socket.id}, headers: ${socket.request.headers}`
    );
    socket.on("disconnect", (reason) => {
        console.log(`user ${socket.id} disconnected for ${reason}`);
    });
});

/*


// Graceful shutdown - Freeing the port once we exit the editor
process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)

function gracefulShutdown() {
  console.log('Signal received: closing HTTP server')

  // Close socket.io server
  io.close(() => {
    console.log('Socket.io server closed')
  })
  // Then close http server
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
}
*/

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.log('Address in use, retrying...');
        setTimeout(() => {
            server.close();
            server.listen(port);
        }, 1000);
    }
});

