const express = require('express');
var cors = require('cors');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = "localhost";
const API_SERVICE_URL = "https://jsonplaceholder.typicode.com";
const CONTAINER_URL = "http://localhost:9000/CAH-root-config.js";
const TODO_URL = "http://localhost:3001/index.js";
const SINGLE_SPA_URL = "http://cdn.jsdelivr.net/npm/single-spa@5.9.0/lib/system/single-spa.min.js";
const REACT_URL = "http://cdn.jsdelivr.net/npm/react@17.0.1/umd/react.production.min.js";
const REACT_DOM_URL = "http://cdn.jsdelivr.net/npm/react-dom@17.0.1/umd/react-dom.production.min.js";
const TODO_JS_URL = "../Todo-app/todo/src/index.js";



// proxy middleware options
const containerOptions = {
    target: 'http://localhost:9000', // target host
    changeOrigin: true, // needed for virtual hosted sites
    // ws: true, // proxy websockets
    // pathRewrite: {
    //   '^localhost:3000/contianer': CONTAINER_URL, // rewrite path
    // },
    secure: false,
    router: {
      // when request.headers.host == 'dev.localhost:3000',
      // override target 'http://www.example.org' to 'http://localhost:8000'
      '**/container': CONTAINER_URL,
    },
  };

  const todoOptions = {
    target: 'http://localhost:3001', // target host
    changeOrigin: true, // needed for virtual hosted sites
    // ws: true, // proxy websockets
    // pathRewrite: {
    //   '^localhost:3000/todo': TODO_URL, // rewrite path
    // }
    logLevel: "debug",
    headers: {
      origin: "*",
    },
    followRedirects: true,
    secure: false,
    router: {
      // when request.headers.host == 'dev.localhost:3000',
      // override target 'http://www.example.org' to 'http://localhost:8000'
      '**/todo': TODO_URL,
      '*': TODO_URL
    },
  };

  const singleSpaOptions = {
    target: 'http://cdn.jsdelivr.net/npm/single-spa@5.9.0/lib/system/single-spa.min.js',
    changeOrigin: true,
    logLevel: "debug",
    headers: {
      origin: "*",
    },
    followRedirects: true,
    secure: false,
    router: {
      '**/todo': SINGLE_SPA_URL,
    }
  };

  const reactOptions = {
    target: 'http://cdn.jsdelivr.net/npm/react@17.0.1/umd/react.production.min.js',
    changeOrigin: true,
    logLevel: "debug",
    headers: {
      origin: "*",
    },
    followRedirects: true,
    secure: false,
    router: {
      '**/todo': REACT_URL,
    }
  };

  const reactDomOptions = {
    target: 'http://cdn.jsdelivr.net/npm/react-dom@17.0.1/umd/react-dom.production.min.js',
    changeOrigin: true,
    logLevel: "debug",
    headers: {
      origin: "*",
    },
    followRedirects: true,
    secure: false,
    router: {
      '**/todo': REACT_DOM_URL,
    }
  }

  const corsOptions = {
    origin: "*"
  }

  const containerProxy = createProxyMiddleware(containerOptions);
  const todoProxy = createProxyMiddleware(todoOptions);
  const singleSpaProy = createProxyMiddleware(singleSpaOptions);
  const reactProxy = createProxyMiddleware(reactOptions);
  const reactDomProxy = createProxyMiddleware(reactDomOptions);


  app.use(cors(corsOptions));
  app.use('/container', containerProxy);
  app.use('/todo', todoProxy);
  app.use('/single-spa', singleSpaProy);
  app.use('/react', reactProxy);
  app.use('/react-dom', reactDomProxy);
  app.use(express.static(TODO_JS_URL + '/'));

// Logging
// app.use(morgan('dev'));


// // Info GET endpoint
// // app.get('/info', (req, res, next) => {
// //     res.send('This is a proxy service which proxies to Billing and Account APIs.');
// //  });

//  // Authorization
// // app.use('', (req, res, next) => {
// //     if (req.headers.authorization) {
// //         next();
// //     } else {
// //         res.sendStatus(403);
// //     }
// //  });

//  // Proxy endpoints
// app.use('/json_placeholder', createProxyMiddleware({
//     target: API_SERVICE_URL,
//     changeOrigin: true,
//     pathRewrite: {
//         [`^/json_placeholder`]: '',
//     },
//  }));

// app.use('/container', createProxyMiddleware({
//     target: CONTAINER_URL,
//     changeOrigin: true,
//     pathRewrite: {
//         [`^/container`]: '/',
//     },
// }));

// app.use('/todo', createProxyMiddleware({
//     target: TODO_URL,
//     changeOrigin: true,
//     pathRewrite: {
//         [`^/todo`]: '/',
//     },
// }));

 // Start the Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
 });