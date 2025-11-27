CREATE TABLE `employeeAllowances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `empId` int NOT NULL,
  `allowanceId` int NOT NULL,
  `amount` int NOT NULL,
  `createdAt` varchar(50) DEFAULT NULL,
  `updatedAt` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) 
