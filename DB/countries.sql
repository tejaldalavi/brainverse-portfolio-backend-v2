CREATE TABLE `countries` (
  `id` mediumint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `iso3` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numericCode` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iso2` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phoneCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capital` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `currency` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `currencyName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) 

INSERT INTO `ecAdminPanel`.`countries`
(`id`,
`name`,
`iso3`,
`numericCode`,
`iso2`,
`phoneCode`,
`capital`,
`currency`,
`currencyName`,
`createdAt`,
`updatedAt`)
VALUES
(<{id: }>,
<{name: }>,
<{iso3: }>,
<{numericCode: }>,
<{iso2: }>,
<{phoneCode: }>,
<{capital: }>,
<{currency: }>,
<{currencyName: }>,
<{createdAt: }>,
<{updatedAt: CURRENT_TIMESTAMP}>);
