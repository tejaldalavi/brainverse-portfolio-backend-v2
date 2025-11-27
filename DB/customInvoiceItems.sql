CREATE TABLE `customInvoiceItems` (
  `description` varchar(300) DEFAULT NULL,
  `quantity` int NOT NULL,
  `ratePerUnit` int NOT NULL,
  `total` int NOT NULL,
  `discount` int NOT NULL,
  `customeInvoiceProjectId` bigint DEFAULT NULL,
  `createdAt` varchar(50) NOT NULL,
  `updatedAt` varchar(50) NOT NULL,
  `invoicedPerc` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `invoiceId` int NOT NULL,
  PRIMARY KEY (`id`)
) 
