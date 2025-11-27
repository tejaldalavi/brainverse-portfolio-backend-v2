CREATE TABLE `projectInvoiceItem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoiceId` bigint DEFAULT NULL,
  `projectId` int NOT NULL,
  `description` varchar(250) NOT NULL,
  `total` int NOT NULL,
  `ratePerUnit` int NOT NULL,
  `quantity` int NOT NULL,
  `discount` int NOT NULL,
  `createdAt` varchar(250) NOT NULL,
  `updatedAt` varchar(250) NOT NULL,
  `invoicedPerc` int NOT NULL,
  PRIMARY KEY (`id`)
) 
