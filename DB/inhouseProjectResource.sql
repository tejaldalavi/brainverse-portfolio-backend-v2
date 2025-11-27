CREATE TABLE `inhouseProjectResource` (
  `id` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `empId` int NOT NULL,
  `hoursPerDay` int NOT NULL,
  `startDate` varchar(50) DEFAULT NULL,
  `endDate` varchar(50) DEFAULT NULL,
  `createdAt` varchar(50) NOT NULL,
  `updatedAt` varchar(50) NOT NULL,
  `resourceCost` int NOT NULL,
  `taskId` int NOT NULL,
  `invoiceAmount` int NOT NULL DEFAULT '0',
  `invoicedPerc` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) 
