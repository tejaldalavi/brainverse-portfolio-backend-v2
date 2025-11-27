CREATE TABLE `leaves` (
  `id` int NOT NULL AUTO_INCREMENT,
  `empId` int NOT NULL,
  `subject` varchar(50) NOT NULL,
  `description` varchar(300) DEFAULT NULL,
  `startDate` varchar(50) NOT NULL,
  `endDate` varchar(50) NOT NULL,
  `status` int NOT NULL,
  `approvedBy` varchar(50) NOT NULL,
  `createdAt` varchar(50) NOT NULL,
  `updatedAt` varchar(50) NOT NULL,
  `remark` varchar(50) DEFAULT 'null',
  PRIMARY KEY (`id`)
)
