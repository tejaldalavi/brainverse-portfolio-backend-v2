CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fName` varchar(50) NOT NULL,
  `lName` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `profileImage` varchar(500) DEFAULT NULL,
  `jobTitle` varchar(30) NOT NULL,
  `joiningDate` varchar(15) NOT NULL,
  `jobDescription` varchar(100) NOT NULL,
  `resumeLink` varchar(500) DEFAULT NULL,
  `password` varchar(500) NOT NULL,
  `netSallary` int NOT NULL,
  `createdAt` varchar(50) DEFAULT NULL,
  `updatedAt` varchar(50) DEFAULT NULL,
  `isActive` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) 
