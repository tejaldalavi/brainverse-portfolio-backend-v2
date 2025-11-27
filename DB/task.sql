CREATE TABLE `task` (
  `id` int NOT NULL AUTO_INCREMENT,
  `empId` int NOT NULL,
  `moduleId` varchar(50) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `hoursPerDay` int NOT NULL,
  `createdAt` varchar(50) NOT NULL,
  `updatedAt` varchar(50) NOT NULL,
  `projectId` varchar(50) DEFAULT NULL,
  `startDate` varchar(50) NOT NULL,
  `dueDate` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) 