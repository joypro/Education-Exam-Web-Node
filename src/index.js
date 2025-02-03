const express       	=	require('express');
const bodyParser    	=	require('body-parser');
const cors          	=	require('cors');
const helmet        	=	require('helmet');
const morgan       	    =	require('morgan');
const fs            	=	require('fs');
const path          	=	require('path');
const compression 	    = 	require('compression');
const middleware    	=	require('./middleware');
const cookieParser	    =	require('cookie-parser');
const l			        =	require('./utility/logger');
const token		        =	require('./utility/token');

const config 		    =	require('./config');
// const socketIo       = require('socket.io');
const http              = require('http');
const mung              = require('express-mung');

const swaggerJsdoc        = require("swagger-jsdoc");
const swaggerUi               = require("swagger-ui-express");

const db     =     require('./dbconnection').pool


const PORT = process.env.PORT || config.PORT;
const app = express();

// compress all responses
app.use(compression())



app.use(helmet());
// set header for response
app.use(middleware.setResponseHeader);


// /*Swagger Config*/
// const options = {
//     definition: {
//         openapi: "3.0.0",
//         info: {
//             title: "Node API Server",
//             version: "1.0.0",
//             description:
//                 "This is Node.js API application made with Express and documented with Swagger",
//             license: {
//                 name: "MIT",
//                 url: "https://spdx.org/licenses/MIT.html",
//             },
//             contact: {
//                 name: "Edu4Life",
//                 url: "",
//                 email: "info@cliky.com",
//             },
//         },
//         servers: [
//             {
//                 url: "http:localhost:" + process.env.PORT,
//                 description: "Development Server"
//             },
//         ],
//         tags: [],
//     },
//     apis: ["./api-docs/*.yaml"],
// };

// const specs = swaggerJsdoc(options);
// app.use(
//     "/api-docs",
//     swaggerUi.serve,
//     swaggerUi.setup(specs)
// );
// //-----Swager Config------//



// set static path
app.use(express.static(path.resolve(config.FILEPATH)));

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use((err, req, res, next) => {
    if (err) {
        res.status(400).send('error parsing data')
    } else {
        next()
    }
})



// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

app.use(token.decryptRequest);

// app.use(token.authenticateToken);

fs.readdir(config.controllerPath, (err, files) => {
  if(err){
      console.log("error occured");
      console.log(err);
  } else {
      files.forEach(file => {
          app.use('/api' , require(config.controllerPath+file));
      });
  }
});


//For Error Handler
app.use(middleware.errorHandler);

//Handle 404 errors
// app.use(middleware.notFoundEvenHandler);

app.use(token.encryptResponse)

const server = http.createServer(app);


// starting the server
server.listen(PORT, () => {
  l.logger.log('info', 'listening on port '+PORT);
});




const serverShutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);

  // Stop accepting new HTTP requests
  server.close(() => {
    console.log("Stopped accepting new HTTP requests.");
  });

  // Close MySQL connection pool Gracefully
  try {
    await db.promise().end();
    console.log("MySQL pool closed.");
  } catch (err) {
    console.error("Error closing MySQL pool:", err);
  }
  
  // Exit the process
  console.log("Shutdown complete. Exiting...");
  process.exit(0);
};


// Listen for termination signals
process.on("SIGINT", () => serverShutdown("SIGINT"));
process.on("SIGTERM", () => serverShutdown("SIGTERM"));
