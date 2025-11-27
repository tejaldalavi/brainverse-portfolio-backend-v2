CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `empId` int NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) 
