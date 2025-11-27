CREATE TABLE `inhouseProjectModules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `moduleName` varchar(50) NOT NULL,
  `projectId` int NOT NULL,
  `quantity` int NOT NULL,
  `ratePerUnit` int NOT NULL,
  `totalModulePrice` int NOT NULL,
  `startDate` varchar(15) NOT NULL,
  `endDate` varchar(15) NOT NULL,
  `status` int NOT NULL,
  `invoiceStatus` int NOT NULL,
  `createdAt` varchar(50) NOT NULL,
  `updatedAt` varchar(50) NOT NULL,
  `invoicedPerc` int NOT NULL DEFAULT '0',
  `phase` int DEFAULT '1',
  PRIMARY KEY (`id`)
) 
