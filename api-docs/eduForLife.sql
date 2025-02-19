-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 19, 2025 at 10:01 PM
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
(1, 1, 3, 'SSC', 'SSC', -1, -1, 1, 1, '2025-02-17 05:45:07', 0, NULL, NULL),
(2, 1, 3, 'Banking', 'Banking', -1, -1, 1, 1, '2025-02-17 05:45:07', 0, NULL, NULL),
(3, 1, 3, 'UPSC', 'UPSC', -1, -1, 1, 1, '2025-02-17 05:45:07', 0, NULL, NULL),
(4, 1, 3, 'Railway', 'Railway', -1, -1, 1, 1, '2025-02-17 05:45:07', 0, NULL, NULL),
(5, 1, 3, 'Teaching', 'Teaching', -1, -1, 1, 1, '2025-02-17 05:45:07', 0, NULL, NULL),
(6, 1, 3, 'Engineering', 'Engineering', -1, -1, 1, 1, '2025-02-17 05:45:07', 0, NULL, NULL),
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
(3, 'Blogs', 'Quiz', 1, 0, NULL, '2025-02-16 18:44:52', NULL, NULL),
(4, 'Exams', 'Quiz', 1, 0, NULL, '2025-02-16 18:44:52', NULL, NULL);

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
(2, 1, 'Normal User', 1),
(3, 2, 'Premium User', 1),
(4, 3, 'System Supervisor', 1);

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
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userId` int NOT NULL,
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

INSERT INTO `user` (`userId`, `firstName`, `lastName`, `psw`, `username`, `email`, `phone`, `countryCode`, `address`, `profileImgUrl`, `userType`, `status`, `deleted`, `isApproved`, `approvedBy`, `approvedAt`, `approvedRemarks`, `lastActiveDate`, `createdBy`, `createdAt`, `modifiedAt`, `modifiedBy`) VALUES
(4, 'SignUpformData.userName', 'SignUpformData.lastName', '30e36724313b7e3d9fff50e3772f769d361ad626fb228662385235a28499f761', 'poritosh4mdgpr@gmail.com', 'poritosh4mdgpr@gmail.com', 'SignUpformData.phone', NULL, NULL, '/profile/default.png', '1', 0, 0, 1, 0, '2025-02-12 04:02:04', 'Approved By System', NULL, 0, '2025-02-12 04:02:04', NULL, NULL);

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
-- Table structure for table `verificationTokens`
--

CREATE TABLE `verificationTokens` (
  `tokenId` int NOT NULL,
  `userId` int NOT NULL,
  `tokenRefId` int DEFAULT NULL,
  `tokenType` int NOT NULL DEFAULT '0' COMMENT '0=> E-mail, 1=> Phone No.',
  `verifyType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `tokenDescription` varchar(200) DEFAULT NULL,
  `tokenSession` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `token` varchar(255) NOT NULL,
  `expiresAt` timestamp NULL DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '0=> Pending, 1=> Verified, 2=> Expired',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `verificationTokens`
--

INSERT INTO `verificationTokens` (`tokenId`, `userId`, `tokenRefId`, `tokenType`, `verifyType`, `tokenDescription`, `tokenSession`, `token`, `expiresAt`, `status`, `createdAt`) VALUES
(1, 4, 4, 0, 'userSignIn', 'Sign In', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInRva2VuVHlwZSI6MCwidmVyaWZ5VHlwZSI6InVzZXJTaWduSW4iLCJ0b2tlbiI6IjE0NjczMCIsInJlcXRpbWUiOjE3Mzk5ODA5MjA0MTAsImlhdCI6MTczOTk4MDkyMCwiZXhwIjoxNzQwMDY3MzIwfQ.cpSivT0yF95UuuXDTZqE9wwejM-radQjyMNnZYO4Lzc', '146730', '2025-02-19 17:02:00', 0, '2025-02-19 16:02:00');

--
-- Indexes for dumped tables
--

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
-- Indexes for table `mstUserTypes`
--
ALTER TABLE `mstUserTypes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offlineExamQuestion`
--
ALTER TABLE `offlineExamQuestion`
  ADD PRIMARY KEY (`questionId`);

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
-- Indexes for table `verificationTokens`
--
ALTER TABLE `verificationTokens`
  ADD PRIMARY KEY (`tokenId`);

--
-- AUTO_INCREMENT for dumped tables
--

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
-- AUTO_INCREMENT for table `mstUserTypes`
--
ALTER TABLE `mstUserTypes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `offlineExamQuestion`
--
ALTER TABLE `offlineExamQuestion`
  MODIFY `questionId` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
-- AUTO_INCREMENT for table `verificationTokens`
--
ALTER TABLE `verificationTokens`
  MODIFY `tokenId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
