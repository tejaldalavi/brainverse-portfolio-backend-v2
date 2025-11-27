CREATE TABLE `subTask` (
  `id` int NOT NULL AUTO_INCREMENT,
  `taskId` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(300) DEFAULT NULL,
  `startDate` varchar(50) NOT NULL,
  `dueDate` varchar(50) NOT NULL,
  `status` int NOT NULL,
  `priority` int NOT NULL,
  `remark` varchar(300) DEFAULT NULL,
  `updatedBy` varchar(50) NOT NULL,
  `createdAt` varchar(50) NOT NULL,
  `updatedAt` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) 
