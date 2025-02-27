-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 27, 2025 at 02:54 PM
-- Server version: 8.0.41-0ubuntu0.20.04.1
-- PHP Version: 7.4.3-4ubuntu2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eduForLife`
--

-- --------------------------------------------------------

--
-- Table structure for table `clientSettings`
--

CREATE TABLE `clientSettings` (
  `id` int NOT NULL,
  `clientId` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `settingsType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `settingsValue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'productIdentity,1=Code, 2=Name | userLoginParam, 1=phone,2=email | custDocValidation, 1=contactTypeWise,0=company'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `clientSettings`
--

INSERT INTO `clientSettings` (`id`, `clientId`, `title`, `settingsType`, `settingsValue`) VALUES
(1, 1, 'User Limit', 'userLimit', '-1'),
(2, 1, 's System Approval Required?', 'systemApprovalRequired', '0');

-- --------------------------------------------------------

--
-- Table structure for table `clientUser`
--

CREATE TABLE `clientUser` (
  `id` int NOT NULL,
  `userId` int NOT NULL DEFAULT '0' COMMENT 'id from user table',
  `parentUserId` int DEFAULT NULL,
  `clientId` int DEFAULT NULL,
  `firstName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profileImgUrl` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `countryCode` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dob` datetime DEFAULT NULL,
  `gender` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userType` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '2' COMMENT '0=>Super admin, 1=> Company Admin, 2=>Normal User',
  `geoLocation` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lattitude` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `longitude` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `designationId` int DEFAULT NULL,
  `departmentId` int NOT NULL DEFAULT '0',
  `dateOfJoining` datetime DEFAULT NULL,
  `remark` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `erpCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1' COMMENT '1=actiive, 0=inactive',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0=notdeleted, 1=deleted',
  `isApproved` tinyint NOT NULL DEFAULT '1' COMMENT '0 => No, 1=> yes',
  `createdBy` int DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` datetime DEFAULT NULL,
  `modifiedBy` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `clientUser`
--

INSERT INTO `clientUser` (`id`, `userId`, `parentUserId`, `clientId`, `firstName`, `lastName`, `profileImgUrl`, `email`, `phone`, `countryCode`, `address`, `dob`, `gender`, `userType`, `geoLocation`, `lattitude`, `longitude`, `designationId`, `departmentId`, `dateOfJoining`, `remark`, `erpCode`, `status`, `deleted`, `isApproved`, `createdBy`, `createdAt`, `modifiedAt`, `modifiedBy`) VALUES
(3, 6, NULL, 0, 'joy', '', '/profile/default.png', 'poritosh4mdgpr@gmail.com', '/profile/default.png', '91', 'India', NULL, '', '1', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, '1', 0, 1, 0, '2025-02-25 18:04:42', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `courseExamMapping`
--

CREATE TABLE `courseExamMapping` (
  `materialId` int NOT NULL,
  `courseId` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=> Inactive, 1=> Active, 2=> Deleted ',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0=> Not Deleted, 1 => Deleted ',
  `createdBy` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `courseMaterialMapping`
--

CREATE TABLE `courseMaterialMapping` (
  `materialId` int NOT NULL,
  `courseId` int NOT NULL,
  `subjectId` int NOT NULL,
  `materialTypeId` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=> Inactive, 1=> Active, 2=> Deleted ',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0=> Not Deleted, 1 => Deleted ',
  `createdBy` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `examQuestions`
--

CREATE TABLE `examQuestions` (
  `questionId` int NOT NULL,
  `examId` int DEFAULT NULL,
  `question` varchar(255) DEFAULT NULL,
  `questionType` int DEFAULT NULL,
  `points` int DEFAULT '0',
  `options` text NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=> Inactive, 1=> Active, 2=> Deleted ',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0=> Not Deleted, 1 => Deleted ',
  `createdBy` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `examId` int NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `description` text,
  `examStart` timestamp NULL DEFAULT NULL,
  `examEnd` timestamp NULL DEFAULT NULL,
  `examType` tinyint DEFAULT '0' COMMENT '0=> Online, 1=> Offline',
  `courseId` int DEFAULT NULL,
  `materialId` int DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=> Inactive, 1=> Active, 2=> Deleted ',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0=> Not Deleted, 1 => Deleted ',
  `createdBy` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mstClient`
--

CREATE TABLE `mstClient` (
  `clientId` int NOT NULL,
  `clientSecret` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clientName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shortCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `companyKey` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `countryCode` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isDefaultLocation` int DEFAULT '0' COMMENT '0=No,1=Yes',
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '1',
  `deleted` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `createdBy` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` datetime DEFAULT NULL,
  `modifiedBy` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mstClient`
--

INSERT INTO `mstClient` (`clientId`, `clientSecret`, `clientName`, `shortCode`, `companyKey`, `email`, `countryCode`, `phone`, `isDefaultLocation`, `address`, `status`, `deleted`, `createdBy`, `createdAt`, `modifiedAt`, `modifiedBy`) VALUES
(1, NULL, 'No Client', 'Independent', NULL, 'admin@mail.com', '91', '9999999999', 0, NULL, '1', '0', 1, '2025-02-21 05:44:59', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mstCourseExams`
--

CREATE TABLE `mstCourseExams` (
  `materialId` int NOT NULL,
  `courseId` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=> Inactive, 1=> Active, 2=> Deleted ',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0=> Not Deleted, 1 => Deleted ',
  `createdBy` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mstCourses`
--

CREATE TABLE `mstCourses` (
  `courseId` int NOT NULL,
  `courseName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `courseAccessType` int DEFAULT '1' COMMENT '0=> Admin Module,1=> User Module, 2= Others',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=> Inactive, 1=> Active, 2=> Deleted ',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0=> Not Deleted, 1 => Deleted ',
  `createdBy` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `mstCourses`
--

INSERT INTO `mstCourses` (`courseId`, `courseName`, `courseAccessType`, `status`, `deleted`, `createdBy`, `createdAt`, `modifiedBy`, `modifiedAt`) VALUES
(1, 'SSC', 1, 1, 0, 4, '2025-02-15 03:37:35', NULL, NULL),
(2, 'Banking', 1, 1, 0, 4, '2025-02-15 03:37:58', NULL, NULL),
(3, 'UPSC', 1, 1, 0, 4, '2025-02-15 03:38:12', NULL, NULL),
(4, 'Railway', 1, 1, 0, 4, '2025-02-15 03:38:12', NULL, NULL),
(5, 'Teaching', 1, 1, 0, 4, '2025-02-15 03:38:12', NULL, NULL),
(6, 'Engineering', 1, 1, 0, 4, '2025-02-15 03:38:12', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mstCourseSubjects`
--

CREATE TABLE `mstCourseSubjects` (
  `subjectId` int NOT NULL,
  `courseId` int NOT NULL COMMENT 'Mst Course Id',
  `subjectName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `subjectDescription` varchar(255) DEFAULT NULL COMMENT '0=> Admin Module,1=> User Module, 2= Others',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=> Inactive, 1=> Active, 2=> Deleted ',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0=> Not Deleted, 1 => Deleted ',
  `createdBy` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `mstCourseSubjects`
--

INSERT INTO `mstCourseSubjects` (`subjectId`, `courseId`, `subjectName`, `subjectDescription`, `status`, `deleted`, `createdBy`, `createdAt`, `modifiedBy`, `modifiedAt`) VALUES
(1, 1, 'Constable', '1', 1, 0, 4, '2025-02-15 03:37:35', NULL, NULL),
(2, 2, 'Banking', '1', 1, 0, 4, '2025-02-15 03:37:58', NULL, NULL),
(3, 3, 'UPSC', '1', 1, 0, 4, '2025-02-15 03:38:12', NULL, NULL),
(4, 4, 'Railway', '1', 1, 0, 4, '2025-02-15 03:38:12', NULL, NULL),
(5, 5, 'Teaching', '1', 1, 0, 4, '2025-02-15 03:38:12', NULL, NULL),
(6, 6, 'Engineering', '1', 1, 0, 4, '2025-02-15 03:38:12', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mstHierarchy`
--

CREATE TABLE `mstHierarchy` (
  `hmId` int NOT NULL,
  `hmName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slNo` int NOT NULL DEFAULT '0',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=> Inactive, 1=> Active, 2=> Deleted',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mstHierarchy`
--

INSERT INTO `mstHierarchy` (`hmId`, `hmName`, `slNo`, `status`, `createdAt`) VALUES
(1, 'Course', 1, 1, '2023-06-09 02:54:32'),
(2, 'Exams', 2, 1, '2023-06-09 02:54:32');

-- --------------------------------------------------------

--
-- Table structure for table `mstHierarchyData`
--

CREATE TABLE `mstHierarchyData` (
  `hierarchyDataId` int NOT NULL,
  `hmId` int NOT NULL,
  `mstHierarchyTypeId` int NOT NULL DEFAULT '0' COMMENT 'hierarchyTypeId from  mstHierarchyTypes',
  `hmName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hmDescription` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parentHMtypId` int NOT NULL,
  `parentHMId` int NOT NULL,
  `leafLevel` tinyint NOT NULL DEFAULT '1' COMMENT '0=last leaf',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=> Inactive, 1=> Active, 2=> Deleted	',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int NOT NULL DEFAULT '0',
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mstHierarchyData`
--

INSERT INTO `mstHierarchyData` (`hierarchyDataId`, `hmId`, `mstHierarchyTypeId`, `hmName`, `hmDescription`, `parentHMtypId`, `parentHMId`, `leafLevel`, `status`, `createdAt`, `createdBy`, `modifiedBy`, `modifiedAt`) VALUES
(1, 1, 3, 'SSC', 'SSC', 0, 0, 1, 1, '2025-02-17 05:45:07', 0, NULL, NULL),
(2, 1, 3, 'Banking', 'Banking', 0, 0, 1, 1, '2025-02-17 05:45:07', 0, NULL, NULL),
(3, 1, 3, 'UPSC', 'UPSC', 0, 0, 1, 1, '2025-02-17 05:45:07', 0, NULL, NULL),
(4, 1, 3, 'Railway', 'Railway', 0, 0, 1, 1, '2025-02-17 05:45:07', 0, NULL, NULL),
(5, 1, 3, 'Teaching', 'Teaching', 0, 0, 1, 1, '2025-02-17 05:45:07', 0, NULL, NULL),
(6, 1, 3, 'Engineering', 'Engineering', 0, 0, 1, 1, '2025-02-17 05:45:07', 0, NULL, NULL),
(7, 1, 4, 'English language', 'English language', 3, 1, 1, 1, '2025-02-17 06:07:10', 0, NULL, NULL),
(8, 1, 4, 'Geography', 'Geography', 3, 1, 1, 1, '2025-02-17 06:07:10', 0, NULL, NULL),
(9, 1, 4, 'Political Science', 'Political Science', 3, 1, 1, 1, '2025-02-17 06:07:10', 0, NULL, NULL),
(10, 1, 4, 'General Knowledge', 'General Knowledge', 3, 1, 1, 1, '2025-02-17 06:07:10', 0, NULL, NULL),
(11, 1, 4, 'Quantitative Aptitude', 'Quantitative Aptitude', 3, 1, 1, 1, '2025-02-17 06:07:10', 0, NULL, NULL),
(12, 1, 4, 'History', 'History', 3, 1, 1, 1, '2025-02-17 06:07:10', 0, NULL, NULL),
(13, 1, 4, 'Finance & Accounting', 'Finance & Accounting', 3, 1, 1, 1, '2025-02-17 06:07:10', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mstHierarchyType`
--

CREATE TABLE `mstHierarchyType` (
  `hmTypeId` int NOT NULL,
  `hmId` int NOT NULL,
  `hmTypeDesc` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `slNo` int NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=> Inactive, 1=> Active, 2=> Deleted ',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0=> Not Deleted, 1 => Deleted ',
  `createdBy` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `mstHierarchyType`
--

INSERT INTO `mstHierarchyType` (`hmTypeId`, `hmId`, `hmTypeDesc`, `slNo`, `status`, `deleted`, `createdBy`, `createdAt`, `modifiedBy`, `modifiedAt`) VALUES
(3, 1, 'Course', 1, 1, 0, NULL, '2025-02-17 05:03:25', NULL, NULL),
(4, 1, 'Subject', 2, 1, 0, NULL, '2025-02-17 05:03:25', NULL, NULL),
(5, 1, 'Material / Chapter', 3, 1, 0, NULL, '2025-02-17 05:03:25', NULL, NULL),
(6, 1, 'Question / Exam', 4, 1, 0, NULL, '2025-02-17 05:03:25', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mstMaterialTypes`
--

CREATE TABLE `mstMaterialTypes` (
  `id` int NOT NULL,
  `typeName` varchar(200) NOT NULL,
  `typeDescription` varchar(255) DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=> Inactive, 1=> Active, 2=> Deleted ',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0=> Not Deleted, 1 => Deleted ',
  `createdBy` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `mstMaterialTypes`
--

INSERT INTO `mstMaterialTypes` (`id`, `typeName`, `typeDescription`, `status`, `deleted`, `createdBy`, `createdAt`, `modifiedBy`, `modifiedAt`) VALUES
(1, 'Videos', 'Video Links', 1, 0, NULL, '2025-02-16 18:44:52', NULL, NULL),
(2, 'Documents', 'Doc', 1, 0, NULL, '2025-02-16 18:44:52', NULL, NULL),
(3, 'Blogs', 'Text', 1, 0, NULL, '2025-02-16 18:44:52', NULL, NULL),
(4, 'Exams', 'Quiz', 1, 0, NULL, '2025-02-16 18:44:52', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mstModules`
--

CREATE TABLE `mstModules` (
  `id` int NOT NULL,
  `clientId` int NOT NULL DEFAULT '0',
  `parentId` int NOT NULL DEFAULT '0' COMMENT 'id of Self Table. 0=> Root Module',
  `specificModule` int NOT NULL DEFAULT '0' COMMENT '1=CRMweb, 2=SFAweb , 3 = MMSweb, 4 =CRMapp, 5=SFAapp, 6=MMSapp, 7=adminWeb',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sequence` int NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=> Inactive, 1=> Active, 2=> Deleted',
  `createDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mstQuestionTypes`
--

CREATE TABLE `mstQuestionTypes` (
  `id` int NOT NULL,
  `typeName` varchar(100) NOT NULL,
  `typeValue` varchar(50) NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=> Inactive, 1=> Active, 2=> Deleted ',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0=> Not Deleted, 1 => Deleted ',
  `createdBy` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mstUserTypes`
--

CREATE TABLE `mstUserTypes` (
  `id` int NOT NULL,
  `userTypeId` int NOT NULL,
  `userTypeName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=> Inactive, 1=> Active, 2=> Deleted'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mstUserTypes`
--

INSERT INTO `mstUserTypes` (`id`, `userTypeId`, `userTypeName`, `status`) VALUES
(1, 0, 'Super Admin', 1),
(2, 1, 'System Admin', 1),
(3, 2, 'System Supervisor', 1),
(4, 3, 'Organization Admin', 1),
(13, 4, 'Normal User', 1),
(15, 5, 'Premium User', 1),
(16, 6, 'Student', 1);

-- --------------------------------------------------------

--
-- Table structure for table `offlineExamQuestion`
--

CREATE TABLE `offlineExamQuestion` (
  `questionId` int NOT NULL,
  `examId` int DEFAULT NULL,
  `question` varchar(255) DEFAULT NULL,
  `questionType` int DEFAULT NULL,
  `points` int DEFAULT '0',
  `options` text NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=> Inactive, 1=> Active, 2=> Deleted ',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0=> Not Deleted, 1 => Deleted ',
  `createdBy` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `deviceType` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'WEB' COMMENT 'web, android, ios',
  `sessionId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deviceId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fcmToken` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'only for app',
  `createDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastUpdated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userAgent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '0=>active,1=>expired',
  `loginTime` timestamp NULL DEFAULT NULL,
  `logoutTime` timestamp NULL DEFAULT NULL,
  `systemLogout` tinyint NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `session`
--

INSERT INTO `session` (`id`, `userId`, `deviceType`, `sessionId`, `deviceId`, `fcmToken`, `createDate`, `userAgent`, `status`, `loginTime`, `logoutTime`, `systemLogout`) VALUES
(1, 6, 'web', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInVzZXJUeXBlSWQiOiIxIiwiY2xpZW50SWQiOjAsInJvbGVJZCI6bnVsbCwicmVxdGltZSI6MTc0MDUwNzg3MjQ3MSwiaWF0IjoxNzQwNTA3ODcyLCJleHAiOjE3NDA1OTQyNzJ9.pnl-1EraFMWFbxSUI0ddZuz1FBNkIb6_Elmwch1bs80', NULL, NULL, '2025-02-25 18:24:32', '', 0, '2025-02-25 18:24:32', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userId` int NOT NULL,
  `clientId` int NOT NULL COMMENT 'Primary Id of mstClient',
  `clientUserId` int DEFAULT NULL COMMENT 'Primary Id of clientUser',
  `roleId` int DEFAULT '0',
  `firstName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `psw` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `countryCode` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `profileImgUrl` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userType` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1' COMMENT 'userTypeId from mstUserTypes',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1=actiive, 0=inactive',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0=notdeleted, 1=deleted',
  `isApproved` tinyint NOT NULL DEFAULT '1' COMMENT '0 => No, 1=> yes',
  `approvedBy` int NOT NULL DEFAULT '0',
  `approvedAt` timestamp NULL DEFAULT NULL,
  `approvedRemarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lastActiveDate` timestamp NULL DEFAULT NULL,
  `createdBy` int DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT NULL,
  `modifiedBy` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userId`, `clientId`, `clientUserId`, `roleId`, `firstName`, `lastName`, `psw`, `username`, `email`, `phone`, `countryCode`, `address`, `profileImgUrl`, `userType`, `status`, `deleted`, `isApproved`, `approvedBy`, `approvedAt`, `approvedRemarks`, `lastActiveDate`, `createdBy`, `createdAt`, `modifiedAt`, `modifiedBy`) VALUES
(6, 0, 3, NULL, 'joy', '', 'c0067d4af4e87f00dbac63b6156828237059172d1bbeac67427345d6a9fda484', 'poritosh4mdgpr@gmail.com', 'poritosh4mdgpr@gmail.com', '/profile/default.png', '91', 'India', '/profile/default.png', '1', 1, 0, 1, 0, '2025-02-25 18:19:58', 'Approved By System', '2025-02-25 18:19:58', 0, '2025-02-25 18:19:58', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `userCourseMapping`
--

CREATE TABLE `userCourseMapping` (
  `id` int NOT NULL,
  `courseId` int NOT NULL,
  `materialId` int DEFAULT NULL,
  `userId` int NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=> Inactive, 1=> Active, 2=> Deleted ',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0=> Not Deleted, 1 => Deleted ',
  `createdBy` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `userExamReview`
--

CREATE TABLE `userExamReview` (
  `id` int NOT NULL,
  `examId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `review` int DEFAULT '0',
  `description` varchar(255) DEFAULT NULL,
  `userSuggestion` text,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=> Inactive, 1=> Active, 2=> Deleted ',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0=> Not Deleted, 1 => Deleted ',
  `createdBy` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `userRoleModule`
--

CREATE TABLE `userRoleModule` (
  `id` int NOT NULL,
  `clientId` int NOT NULL,
  `specificModule` int DEFAULT NULL COMMENT '1=CRM, 2=SFA , 3 = MMS,4=CRMmob,5=SFAmob,6=MMSmob,7=AdminWeb, 8=DMSweb',
  `accessType` int NOT NULL DEFAULT '0' COMMENT '0=employee,1=customer',
  `roleId` int NOT NULL,
  `moduleId` int NOT NULL COMMENT 'mstModule Id',
  `isView` tinyint NOT NULL DEFAULT '0' COMMENT '1=> Yes, 0=> No	',
  `addPem` tinyint NOT NULL COMMENT '1=> Yes, 0=> No',
  `editPem` tinyint NOT NULL COMMENT '1=> Yes, 0=> No',
  `deletePem` tinyint NOT NULL COMMENT '1=> Yes, 0=> No',
  `approvePem` tinyint NOT NULL COMMENT '1=> Yes, 0=> No',
  `commercialPem` int NOT NULL DEFAULT '0' COMMENT '1=> Yes, 0=> No',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=> Inactive, 1=> Active, 2=> Deleted	',
  `createdBy` int NOT NULL,
  `createDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `modifiedBy` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `userRoles`
--

CREATE TABLE `userRoles` (
  `id` int NOT NULL,
  `clientId` int NOT NULL COMMENT 'id of mastClient Table',
  `roleName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `roleType` tinyint NOT NULL DEFAULT '1' COMMENT '0=systemAdminRoles, 1=userRoles, 2=compnayAdmins, 3=partnerRoles',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=>Inactive, 1=> Active, 2=> deleted',
  `createdBy` int NOT NULL COMMENT 'id of user Table',
  `createDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` int DEFAULT NULL,
  `modifiedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `verificationTokens`
--

CREATE TABLE `verificationTokens` (
  `tokenId` int NOT NULL,
  `userId` int NOT NULL,
  `tokenRefId` int DEFAULT NULL,
  `tokenRefTable` varchar(200) NOT NULL COMMENT 'Table Name of Ref',
  `tokenType` int NOT NULL DEFAULT '0' COMMENT '0=> E-mail, 1=> Phone No.',
  `verifyTypeDescription` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `tokenSession` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `token` varchar(255) NOT NULL,
  `expiresAt` timestamp NULL DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '0=> Pending, 1=> Verified, 2=> Expired',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `verificationTokens`
--

INSERT INTO `verificationTokens` (`tokenId`, `userId`, `tokenRefId`, `tokenRefTable`, `tokenType`, `verifyTypeDescription`, `tokenSession`, `token`, `expiresAt`, `status`, `createdAt`) VALUES
(1, 4, 4, 'user', 0, 'userSignIn', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInRva2VuVHlwZSI6MCwidmVyaWZ5VHlwZSI6InVzZXJTaWduSW4iLCJ0b2tlbiI6IjE0NjczMCIsInJlcXRpbWUiOjE3Mzk5ODA5MjA0MTAsImlhdCI6MTczOTk4MDkyMCwiZXhwIjoxNzQwMDY3MzIwfQ.cpSivT0yF95UuuXDTZqE9wwejM-radQjyMNnZYO4Lzc', '146730', '2025-02-19 17:02:00', 0, '2025-02-19 16:02:00'),
(2, 0, 1, 'clientUser', 0, 'userSignUp', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjAsInRva2VuVHlwZSI6MCwidG9rZW5SZWZUYWJsZSI6ImNsaWVudFVzZXIiLCJ0b2tlbiI6IjU1Mzg0MCIsInRva2VuUmVmSWQiOjEsInJlcXRpbWUiOjE3NDAzOTM4MzI5MjksImlhdCI6MTc0MDM5MzgzMiwiZXhwIjoxNzQwNDgwMjMyfQ.wEapdW2vmL3BON0Q0vh4FBMV_rM7UjW2PBQjtWQrc5U', '553840', '2025-02-24 11:43:52', 1, '2025-02-24 10:43:52'),
(3, 0, 2, 'clientUser', 0, 'userSignUp', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjAsInRva2VuVHlwZSI6MCwidG9rZW5SZWZUYWJsZSI6ImNsaWVudFVzZXIiLCJ0b2tlbiI6Ijg4NTUwOCIsInRva2VuUmVmSWQiOjIsInJlcXRpbWUiOjE3NDA1MDQ0NTc1OTcsImlhdCI6MTc0MDUwNDQ1NywiZXhwIjoxNzQwNTkwODU3fQ.EG-49mnk_-sjA8rDQe15hcBdp0PXjvZI6wgtRt1ZzNE', '885508', '2025-02-25 18:27:37', 0, '2025-02-25 17:27:37'),
(4, 0, 3, 'clientUser', 0, 'userSignUp', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjAsInRva2VuVHlwZSI6MCwidG9rZW5SZWZUYWJsZSI6ImNsaWVudFVzZXIiLCJ0b2tlbiI6IjQ1MDI1MCIsInRva2VuUmVmSWQiOjMsInJlcXRpbWUiOjE3NDA1MDY2ODI4OTAsImlhdCI6MTc0MDUwNjY4MiwiZXhwIjoxNzQwNTkzMDgyfQ.uqREHyvuXj6SiMy4HymCpZbQLC5yJajmwZM1l4YwcFw', '450250', '2025-02-25 19:04:42', 1, '2025-02-25 18:04:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clientSettings`
--
ALTER TABLE `clientSettings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `clientUser`
--
ALTER TABLE `clientUser`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`,`clientId`);

--
-- Indexes for table `courseExamMapping`
--
ALTER TABLE `courseExamMapping`
  ADD PRIMARY KEY (`materialId`);

--
-- Indexes for table `courseMaterialMapping`
--
ALTER TABLE `courseMaterialMapping`
  ADD PRIMARY KEY (`materialId`);

--
-- Indexes for table `examQuestions`
--
ALTER TABLE `examQuestions`
  ADD PRIMARY KEY (`questionId`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`examId`);

--
-- Indexes for table `mstClient`
--
ALTER TABLE `mstClient`
  ADD PRIMARY KEY (`clientId`);

--
-- Indexes for table `mstCourseExams`
--
ALTER TABLE `mstCourseExams`
  ADD PRIMARY KEY (`materialId`);

--
-- Indexes for table `mstCourses`
--
ALTER TABLE `mstCourses`
  ADD PRIMARY KEY (`courseId`);

--
-- Indexes for table `mstCourseSubjects`
--
ALTER TABLE `mstCourseSubjects`
  ADD PRIMARY KEY (`subjectId`);

--
-- Indexes for table `mstHierarchy`
--
ALTER TABLE `mstHierarchy`
  ADD PRIMARY KEY (`hmId`);

--
-- Indexes for table `mstHierarchyData`
--
ALTER TABLE `mstHierarchyData`
  ADD PRIMARY KEY (`hierarchyDataId`),
  ADD KEY `clientId` (`hmId`,`mstHierarchyTypeId`,`hmName`),
  ADD KEY `allLastLevel` (`hmId`,`leafLevel`,`status`);

--
-- Indexes for table `mstHierarchyType`
--
ALTER TABLE `mstHierarchyType`
  ADD PRIMARY KEY (`hmTypeId`);

--
-- Indexes for table `mstMaterialTypes`
--
ALTER TABLE `mstMaterialTypes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mstModules`
--
ALTER TABLE `mstModules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mstUserTypes`
--
ALTER TABLE `mstUserTypes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userTypeId` (`userTypeId`);

--
-- Indexes for table `offlineExamQuestion`
--
ALTER TABLE `offlineExamQuestion`
  ADD PRIMARY KEY (`questionId`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usrSssion` (`userId`,`sessionId`(8));

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userId`),
  ADD KEY `usrLogin` (`status`,`deleted`,`email`);

--
-- Indexes for table `userCourseMapping`
--
ALTER TABLE `userCourseMapping`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userExamReview`
--
ALTER TABLE `userExamReview`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userRoleModule`
--
ALTER TABLE `userRoleModule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usrLgInIndex` (`clientId`,`roleId`,`moduleId`,`status`);

--
-- Indexes for table `userRoles`
--
ALTER TABLE `userRoles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`,`clientId`,`status`);

--
-- Indexes for table `verificationTokens`
--
ALTER TABLE `verificationTokens`
  ADD PRIMARY KEY (`tokenId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clientSettings`
--
ALTER TABLE `clientSettings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `clientUser`
--
ALTER TABLE `clientUser`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `courseExamMapping`
--
ALTER TABLE `courseExamMapping`
  MODIFY `materialId` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `courseMaterialMapping`
--
ALTER TABLE `courseMaterialMapping`
  MODIFY `materialId` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `examQuestions`
--
ALTER TABLE `examQuestions`
  MODIFY `questionId` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `examId` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mstClient`
--
ALTER TABLE `mstClient`
  MODIFY `clientId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `mstCourseExams`
--
ALTER TABLE `mstCourseExams`
  MODIFY `materialId` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mstCourses`
--
ALTER TABLE `mstCourses`
  MODIFY `courseId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `mstCourseSubjects`
--
ALTER TABLE `mstCourseSubjects`
  MODIFY `subjectId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `mstHierarchy`
--
ALTER TABLE `mstHierarchy`
  MODIFY `hmId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mstHierarchyData`
--
ALTER TABLE `mstHierarchyData`
  MODIFY `hierarchyDataId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `mstHierarchyType`
--
ALTER TABLE `mstHierarchyType`
  MODIFY `hmTypeId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `mstMaterialTypes`
--
ALTER TABLE `mstMaterialTypes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `mstModules`
--
ALTER TABLE `mstModules`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mstUserTypes`
--
ALTER TABLE `mstUserTypes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `offlineExamQuestion`
--
ALTER TABLE `offlineExamQuestion`
  MODIFY `questionId` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `session`
--
ALTER TABLE `session`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `userCourseMapping`
--
ALTER TABLE `userCourseMapping`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `userExamReview`
--
ALTER TABLE `userExamReview`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `userRoleModule`
--
ALTER TABLE `userRoleModule`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `userRoles`
--
ALTER TABLE `userRoles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `verificationTokens`
--
ALTER TABLE `verificationTokens`
  MODIFY `tokenId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
