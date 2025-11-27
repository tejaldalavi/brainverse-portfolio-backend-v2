CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `clientId` int NOT NULL,
  `projectTypeId` int NOT NULL,
  `clientCost` int NOT NULL,
  `resourceCost` int NOT NULL,
  `tds` int NOT NULL,
  `sgst` int NOT NULL,
  `cgst` int NOT NULL,
  `igst` int NOT NULL,
  `profit` int NOT NULL,
  `invoiceStatus` int NOT NULL,
  `createdAt` varchar(50) DEFAULT NULL,
  `updatedAt` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
)
