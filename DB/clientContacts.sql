CREATE TABLE `clientContacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clientId` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `designation` varchar(50) NOT NULL,
  `createdAt` varchar(50) DEFAULT NULL,
  `updatedAt` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) 