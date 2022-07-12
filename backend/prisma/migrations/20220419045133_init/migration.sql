-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL,
    "address" TEXT NOT NULL,
    "categoryId" TEXT,
    "employeeCode" TEXT,
    CONSTRAINT "Customer_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Customer_employeeCode_fkey" FOREIGN KEY ("employeeCode") REFERENCES "Employee" ("code") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Employee" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
