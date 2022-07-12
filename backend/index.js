const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const _ = require("lodash");
const fs = require("fs");

const port = 4000;
const PAGE_SIZE = 8;

// xử lý json , phân tích cú pháp
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// xử lý cors
app.use(cors());

// Prisma client
const { PrismaClient } = require("@prisma/client");
const { resourceUsage } = require("process");
const prisma = new PrismaClient();
//http://localhost:4000
app.get("/customer", async (req, res) => {
  var page = req.query.page;
  if(page){
    page = parseInt(page)
    var skip = (page-1)*PAGE_SIZE;
    const cus = await prisma.customer.findMany({
      skip: skip,
      take: PAGE_SIZE,
      include: {
        Category: true,
        Employee: true,
      },
    });
    return res.send(cus)
  }
  else{
      const cus = await prisma.customer.findMany({
      include: {
        Category: true,
        Employee: true,
      },
    });
    
    return res.send(cus);
  }
  
});

app.get("/customer/count", async (req,res)=>{
  let count = await prisma.customer.count()
  count =Math.ceil( count /  PAGE_SIZE)

  res.send({
    count: count
  })
})

app.get("/customer/:id", async (req, res) => {
  const cus = await prisma.customer.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      Category: true,
      Employee: true,
    },
  });
  return res.send(cus);
});



app.post("/customer", async (req, res) => {
  const body = req.body;
  const cus = await prisma.customer.create({
    data: {
      code: body.code,
      name: body.name,
      mobile: body.mobile,
      address: body.address,
      dateOfBirth: new Date(body.dateOfBirth),
      categoryId: body.categoryId || null,
      employeeId: body.employeeId || null,
    },
  });
  res.send(cus);
  
});

app.put("/customer/:id", async (req, res) => {
  const body = req.body;
  // TODO check input
  try {
  const cus = await prisma.customer.update({
    where: {
      id: req.params.id,
    },
    data: {
      code: body.code,
      name: body.name,
      mobile: body.mobile,
      address: body.address,
      dateOfBirth: new Date(body.dateOfBirth),
      categoryId: body.categoryId || null,
      employeeId: body.employeeId || null,
    },
  });
  res.send(cus);
}catch {
  res.send("Error")
}
  
});

app.delete("/customer/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send({
      message: "id is required",
    });
  }
  const cus = await prisma.customer.delete({
    where: {
      id: id,
    },
  });
 res.send(cus);
});

// CRUD category
app.get("/category", async (req, res) => {
  const cate = await prisma.category.findMany();
  return res.send(cate);
});
app.get("/category/:id", async (req, res) => {
  const cate = await prisma.category.findUnique({
    where: {
      id: req.params.id,
    },
  });
  return res.send(cate);
});
app.post("/category", async (req, res) => {
  const body = req.body;
  const cate = await prisma.category.create({
    data: {
      code: body.code,
      name: body.name,
    },
  });
  res.send(cate);
});

app.put("/category/:id", async (req, res) => {
  const body = req.body;

  const cate = await prisma.category.update({
    where: {
      id: req.params.id,
    },
    data: {
      code: body.code,
      name: body.name,
    },
  });

  res.send(cate);
});

app.delete("/category/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send({
      message: "id is required",
    });
  }
  const cate = await prisma.category.delete({
    where: {
      id: id,
    },
  });
  res.send(cate);
});

// CRUD employee
app.get("/employee", async (req, res) => {
  const cate = await prisma.employee.findMany();
  return res.send(cate);
});

app.get("/employee/:id", async (req, res) => {
  const cate = await prisma.employee.findUnique({
    where: {
      id: req.params.id,
    },
  });
  return res.send(cate);
});

app.post("/employee", async (req, res) => {
  const body = req.body;
  const emp = await prisma.employee.create({
    data: {
      name: body.name,
      code: body.code,
    },
  });
  res.send(emp);
});
app.put("/employee/:id", async (req, res) => {
  const body = req.body;
  const emp = await prisma.employee.update({
    where: {
      id: req.params.id,
    },
    data: {
      name: body.name,
      code: body.code,
    },
  });
  res.send(emp);
});

app.delete("/employee/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send({
      message: "id is required",
    });
  }
  const emp = await prisma.employee.delete({
    where: {
      id: id,
    },
  });
  res.send(emp);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
