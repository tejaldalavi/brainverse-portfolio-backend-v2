CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `companyName` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `logo` varchar(500) NOT NULL,
  `clientSource` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `district` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `address` varchar(500) NOT NULL,
  `billingAddress` varchar(500) NOT NULL,
  `createdAt` varchar(50) DEFAULT NULL,
  `updatedAt` varchar(50) DEFAULT NULL,
  `gstNumber` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) 
