CREATE TABLE `resourceOutsource` (
  `id` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `empId` int NOT NULL,
  `durationType` int NOT NULL,
  `clientCost` int NOT NULL,
  `resourceCost` int NOT NULL,
  `startDate` varchar(15) NOT NULL,
  `endDate` varchar(15) NOT NULL,
  `invoiceStatus` int NOT NULL,
  `hoursPerDay` int NOT NULL,
  `createdAt` varchar(50) NOT NULL,
  `updatedAt` varchar(50) NOT NULL,
  `taskId` int NOT NULL,
  `invoicedPerc` int NOT NULL,
  PRIMARY KEY (`id`)
) 