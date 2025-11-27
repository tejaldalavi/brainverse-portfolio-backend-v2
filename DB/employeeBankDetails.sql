CREATE TABLE `employeeBankDetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `empId` int NOT NULL,
  `bankName` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `accountNumber` int NOT NULL,
  `ifsc` varchar(50) NOT NULL,
  `updatedAt` varchar(50) DEFAULT NULL,
  `createdAt` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
)  
