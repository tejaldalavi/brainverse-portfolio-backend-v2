CREATE TABLE `clientDocuments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clientId` int NOT NULL,
  `documentLink` varchar(500) DEFAULT NULL,
  `documentName` varchar(50) NOT NULL,
  `description` varchar(300) DEFAULT NULL,
  `updatedAt` varchar(50) DEFAULT NULL,
  `createdAt` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) 
