-- Initial Create Migration
CREATE TABLE IF NOT EXISTS `Users` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Email` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `PasswordHash` longtext CHARACTER SET utf8mb4 NOT NULL,
    `FirstName` longtext CHARACTER SET utf8mb4 NULL,
    `LastName` longtext CHARACTER SET utf8mb4 NULL,
    `PhoneNumber` longtext CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NULL,
    `UpdatedAt` datetime(6) NULL,
    CONSTRAINT `PK_Users` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Cars` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Make` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Model` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Year` int NOT NULL,
    `Price` decimal(65,30) NOT NULL,
    `Mileage` int NOT NULL,
    `FuelType` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Transmission` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Color` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Description` longtext CHARACTER SET utf8mb4 NOT NULL,
    `ImageUrls` longtext CHARACTER SET utf8mb4 NOT NULL,
    `UserId` int NOT NULL,
    `CreatedAt` datetime(6) NULL,
    `UpdatedAt` datetime(6) NULL,
    CONSTRAINT `PK_Cars` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Cars_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE INDEX `IX_Cars_UserId` ON `Cars` (`UserId`);
CREATE UNIQUE INDEX `IX_Users_Email` ON `Users` (`Email`);

-- Migration history table
CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260122180043_InitialCreate', '8.0.0'),
       ('20260130093259_AddImageUrlsToCar', '8.0.0')
ON DUPLICATE KEY UPDATE `MigrationId`=`MigrationId`;
