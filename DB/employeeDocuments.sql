CREATE TABLE `employeeDocuments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `empId` int NOT NULL,
  `documentLink` varchar(500) DEFAULT NULL,
  `documentName` varchar(50) NOT NULL,
  `updatedAt` varchar(50) DEFAULT NULL,
  `createdAt` varchar(50) DEFAULT NULL,
  `required` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) 
