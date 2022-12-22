const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/api/v1/users", (req, res) => {
  fs.readFile("./dev-data/data/users.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).json({
        err: err,
        status: "fail",
        message: err.message,
      });
    } else {
      res.status(200).json({
        data: JSON.parse(data),
        status: "success",
      });
    }
  });
});

app.get("/api/v1/users/:id", checkExistById, (req, res) => {
  let { id } = req.params; // object destructuring
  // let id = req.params.id;
  // Tiến hành đọc file users.json
  fs.readFile("./dev-data/data/users.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).json({
        err: err,
        status: "fail",
        message: err.message,
      });
    }
    data = JSON.parse(data);
    let find = data.find((e, i) => e._id === id);
    res.status(200).json({
      data: find,
      status: "success",
    });
  });
  // Tiến hành tìm kiếm những obj có _id trùng với id

  // Tiến hành res về cho client
});

app.post("/api/v1/users", (req, res) => {
  let user = req.body;
  let { email } = req.body;

  fs.readFile("./dev-data/data/users.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).json({
        err: err,
        status: "fail",
        message: err.message,
      });
    }
    data = JSON.parse(data);
    let find = data.find((e, i) => e.email === email);
    if (find) {
      res.status(301).json({
        message: "User already exists",
      });
    } else {
      data.push(user);
      fs.writeFile(
        "./dev-data/data/users.json",
        JSON.stringify(data),
        (err) => {
          if (err) {
            res.status(500).json({
              err: err,
              status: "fail",
              message: err.message,
            });
          }
          res.status(200).json({
            status: "success",
            message: "Create successfully",
          });
        }
      );
    }
  });
});

app.put("/api/v1/users/:id", checkExistById, (req, res) => {
  let { id } = req.params;
  let { name } = req.body;
  fs.readFile("./dev-data/data/users.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).json({
        status: "fail",
        err: err,
        message: err.message,
      });
    }
    data = JSON.parse(data);
    let findIndex = data.findIndex((e, i) => e._id === id);
    data[findIndex].name = name;
    fs.writeFile("./dev-data/data/users.json", JSON.stringify(data), (err) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          err: err,
          message: err.message,
        });
      }
      res.status(200).json({
        status: "success",
        message: "Update successfully",
      });
    });
  });
});

app.delete("/api/v1/users/:id", (req, res) => {
  let { id } = req.params;
  fs.readFile("./dev-data/data/users.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).json({
        status: "fail",
        err: err,
        message: err.message,
      });
    }
    data = JSON.parse(data);
    let findIndex = data.findIndex((e, i) => e._id === id);
    if (findIndex === -1) {
      res.status(500).json({
        status: "fail",
        message: "User not found",
      });
    } else {
      data.splice(findIndex, 1);
      fs.writeFile(
        "./dev-data/data/users.json",
        JSON.stringify(data),
        (err) => {
          if (err) {
            res.status(500).json({
              status: "fail",
              err: err,
              message: err.message,
            });
          }
          res.status(200).json({
            status: "success",
            message: "Delete successfully",
          });
        }
      );
    }
  });
});

// Middleware -> một function nằm giữa endpoint và callback function
// cuối cùng
// Lọc, làm sạch các request
// Các middleware giống như các bài test
// Khi mà vượt qua một middleware, thì mình sẽ next sang các middleware mới

// Bản chất của express, là các middleware lồng với nhau

// function middleware1(req, res, next) {
//   // logic check 1
//   // Sẽ có một logic check 1
//   // Nếu không thành công thì sẽ ngay lập tức response về cho client
//   console.log("check 1");
//   // Khi đã thành công
//   next();
// }

// function middleware2(req, res, next) {
//   // logic check 2
//   // Sẽ có một logic check 2
//   // Nếu không thành công thì sẽ ngay lập tức response về cho client
//   console.log("check 2");
//   // Khi đã thành công
//   next();
// }

// function middleware3(req, res, next) {
//   // logic check 3
//   // Sẽ có một logic check 3
//   // Nếu không thành công thì sẽ ngay lập tức response về cho client
//   console.log("check 3");
//   // Khi đã thành công
//   next();
// }

function checkExistById(req, res, next) {
  let { id } = req.params;
  fs.readFile("./dev-data/data/users.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).json({
        status: "fail",
        err: err,
        message: err.message,
      });
    }
    data = JSON.parse(data);
    let find = data.find((e) => e._id === id);
    if (!find) {
      res.status(500).json({
        message: "User not found",
      });
    } else {
      next();
    }
  });
}

// map, filter, reduce, sort, find, findIndex (Array es6)

app.get("/", (req, res) => {
  res.send("<h1>This is homepage</h1>");
});

app.get("/overview", (req, res) => {
  res.send("<h1>This is overview page</h1>");
});

app.get("/product", (req, res) => {
  res.send("<h1>This is product page</h1>");
});

app.get("*", (req, res) => {
  res.send("<h1>Page not found</h1>");
});

app.listen(port, () => {
  console.log("Server is running on http://localhost:3000");
});

// API (Application Programming Interface)
// - Tổ hợp các endpoint trả về hoặc xử lý dữ
// liệu dạng JSON để build được những website CSR
// (client-side rendering) dynamic website
