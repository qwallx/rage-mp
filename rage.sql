-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 03, 2022 at 04:40 PM
-- Server version: 5.7.36
-- PHP Version: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cyberweb_rage`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `username` varchar(35) NOT NULL,
  `password` varchar(256) NOT NULL,
  `email` varchar(50) NOT NULL DEFAULT '',
  `money` int(20) NOT NULL DEFAULT '5000',
  `moneyBank` int(20) NOT NULL DEFAULT '5000',
  `premiumPoints` int(11) NOT NULL DEFAULT '0',
  `admin` int(11) NOT NULL DEFAULT '0',
  `helper` int(11) NOT NULL DEFAULT '0',
  `level` int(11) NOT NULL DEFAULT '1',
  `experience` int(11) NOT NULL DEFAULT '0',
  `needExperience` int(11) NOT NULL DEFAULT '300',
  `hours` int(11) NOT NULL DEFAULT '0',
  `modelPlayer` varchar(100) NOT NULL DEFAULT 'a_m_y_beachvesp_01',
  `playerPremium` int(11) NOT NULL DEFAULT '0',
  `playerWarns` int(11) NOT NULL DEFAULT '0',
  `drivingLicense` int(11) NOT NULL DEFAULT '0',
  `job` int(11) NOT NULL DEFAULT '-1',
  `house` int(11) NOT NULL DEFAULT '-1',
  `business` int(11) NOT NULL DEFAULT '999',
  `mute` int(11) NOT NULL DEFAULT '0',
  `spawnChange` int(11) NOT NULL DEFAULT '0',
  `playerGroup` int(11) NOT NULL DEFAULT '-1',
  `playerGroupRank` int(11) NOT NULL DEFAULT '0',
  `playerGroupFP` int(11) NOT NULL DEFAULT '0',
  `playerGroupWarns` int(11) NOT NULL DEFAULT '0',
  `playerGroupDays` int(11) NOT NULL DEFAULT '0',
  `wanted` int(11) NOT NULL DEFAULT '0',
  `wantedTime` int(11) NOT NULL DEFAULT '0',
  `wantedCrimes` varchar(100) NOT NULL DEFAULT '',
  `wantedCrimeTime` varchar(100) NOT NULL DEFAULT '',
  `wantedCaller` varchar(100) NOT NULL DEFAULT '',
  `water` int(11) NOT NULL DEFAULT '100',
  `food` int(11) NOT NULL DEFAULT '100',
  `sex` varchar(50) NOT NULL DEFAULT 'Male',
  `skin` varchar(50) NOT NULL DEFAULT 'a_m_y_beachvesp_01',
  `vehicleSlots` int(11) NOT NULL DEFAULT '2',
  `totalVehs` int(11) NOT NULL DEFAULT '0',
  `playerLastOnline` varchar(100) NOT NULL DEFAULT 'no last login',
  `status` int(11) NOT NULL DEFAULT '0',
  `phoneNumber` varchar(10) NOT NULL DEFAULT '',
  `lastSpawnX` float NOT NULL DEFAULT '-1041.15',
  `lastSpawnY` float NOT NULL DEFAULT '-2744.27',
  `lastSpawnZ` float NOT NULL DEFAULT '21.359',
  `lastSpawnA` float NOT NULL DEFAULT '327.559',
  `playerCrimes` int(11) NOT NULL DEFAULT '0',
  `playerArrests` int(11) NOT NULL DEFAULT '0',
  `helperChat` int(11) NOT NULL DEFAULT '1',
  `groupChat` int(11) NOT NULL DEFAULT '1',
  `hudStatus` int(11) NOT NULL DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `username`, `password`, `email`, `money`, `moneyBank`, `premiumPoints`, `admin`, `helper`, `level`, `experience`, `needExperience`, `hours`, `modelPlayer`, `playerPremium`, `playerWarns`, `drivingLicense`, `job`, `house`, `business`, `mute`, `spawnChange`, `playerGroup`, `playerGroupRank`, `playerGroupFP`, `playerGroupWarns`, `playerGroupDays`, `wanted`, `wantedTime`, `wantedCrimes`, `wantedCrimeTime`, `wantedCaller`, `water`, `food`, `sex`, `skin`, `vehicleSlots`, `totalVehs`, `playerLastOnline`, `status`, `phoneNumber`, `lastSpawnX`, `lastSpawnY`, `lastSpawnZ`, `lastSpawnA`, `playerCrimes`, `playerArrests`, `helperChat`, `groupChat`, `hudStatus`) VALUES
(1, 'MihaiADV', '$2a$10$xL34NbhmpVJgSvWlqnbgOe5gW.7HXt3PEJKxTqqNenjWH14DsjXZe', 'stroemihai2002@gmail.com', 0, 2350, 0, 7, 0, 1, 0, 300, 0, 'a_m_y_beachvesp_01', 0, 0, 100, 0, -1, 999, 0, 0, -1, 0, 0, 0, 0, 0, 0, '', '', '', 0, 0, 'Male', 'a_m_y_beachvesp_01', 2, 0, '6 mar 2021 [0 : 41]', 1, '', -1083.59, -2683.02, 20.2028, 26.9925, 0, 0, 1, 1, 1),
(2, 'skema', '$2a$10$u9L1Jtsm8s/MONwdbTCcV.7kuXc4WE6ENFF6yZiSEsDtJtpWCtNva', 'asdasd', 5000, 5000, 0, 0, 0, 1, 0, 300, 0, 'a_m_y_beachvesp_01', 0, 0, 0, -1, -1, 999, 0, 0, -1, 0, 0, 0, 0, 0, 0, '', '', '', 100, 100, 'Male', 'a_m_y_beachvesp_01', 2, 0, 'no last login', 0, '', -1041.15, -2744.27, 21.359, 327.559, 0, 0, 1, 1, 1),
(3, 'mihaiadv1', '$2a$10$dxQ7K9UBH2txSqWwEZuyi.Vpd40cbA1hZCfCyN8FAYl/HPJmh0jFa', 'asdasd', 5000, 5000, 0, 0, 0, 1, 0, 300, 0, 'a_m_y_beachvesp_01', 0, 0, 0, -1, -1, 999, 0, 0, -1, 0, 0, 0, 0, 0, 0, '', '', '', 100, 100, 'Male', 'a_m_y_beachvesp_01', 2, 0, '4 feb 2021 [15 : 38]', 1, '', 402.866, -996.411, -99.0003, 174.999, 0, 0, 1, 1, 1),
(4, 'Flint', '$2a$10$xQZW3EUk4rAeUANT6ABzb.LCzrAF77X3xdykoZBeYY3qecLo6XNUy', 'flint@here.com', 2200, 5000, 0, 7, 0, 1, 0, 300, 0, 'a_m_y_beachvesp_01', 0, 0, 100, -1, -1, 999, 0, 0, -1, 0, 0, 0, 0, 0, 0, '', '', '', 0, 0, 'Male', 'a_m_y_beachvesp_01', 2, 0, '17 feb 2021 [1 : 34]', 1, '', -699.003, -2140.57, 12.6916, 8.22236, 0, 0, 1, 1, 1),
(5, 'TUDQR', '$2a$10$LfRywz91FcnDsr7Hk4h.A.5IAMIxwLQ6ljyKJgfW00HaMPtjzPecW', '@yahoo.com', 5000, 5000, 0, 7, 0, 1, 0, 300, 0, 'a_m_y_beachvesp_01', 0, 0, 100, -1, -1, 999, 0, 0, -1, 0, 0, 0, 0, 0, 0, '', '', '', 50, 50, 'Male', 'a_m_y_beachvesp_01', 2, 0, '11 feb 2021 [20 : 50]', 1, '', 8.7711, -2620.4, 26.6691, -137.126, 0, 0, 1, 1, 1),
(6, 'wefx', '$2a$10$fbjPbRrr8LGVCCdjKwiyaO35JRjNUxsCCjtEZbA7C8X9n.Kr8Nk7W', 'wefxyoutube@hotmail.com', 5000, 5000, 0, 7, 0, 1, 0, 300, 0, 'a_m_y_beachvesp_01', 0, 0, 100, -1, -1, 999, 0, 0, -1, 0, 0, 0, 0, 0, 0, '', '', '', 70, 70, 'Male', 'a_m_y_beachvesp_01', 2, 0, '11 feb 2021 [21 : 14]', 1, '', -806.273, -2197.44, 16.2663, 0.624935, 0, 0, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `player_inventory`
--

CREATE TABLE `player_inventory` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` int(11) NOT NULL DEFAULT '501',
  `indexItem` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '-1',
  `invColor` int(11) NOT NULL DEFAULT '0',
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'burger',
  `quantity` int(40) NOT NULL DEFAULT '0',
  `invUsed` tinyint(1) NOT NULL DEFAULT '0',
  `gender` int(11) NOT NULL DEFAULT '-1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `player_inventory`
--

INSERT INTO `player_inventory` (`id`, `userId`, `type`, `indexItem`, `invColor`, `name`, `quantity`, `invUsed`, `gender`) VALUES
(5, 4, 3, 'jeans', 0, 'Black jeans', 1, 0, 0),
(17, 4, 26, 'jeans', 0, 'Urban black jeans', 2, 1, 0),
(18, 4, 19, 'shoes', 0, 'White & black shoes', 1, 0, 0),
(24, 1, 103, 'hat', 0, 'Blue Cap', 1, 1, 0),
(25, 1, 501, '-1', 0, 'Water Bottle', 1, 0, -1),
(26, 1, 500, '-1', 0, 'Hamburger', 2, 0, -1),
(27, 1, 4, 'jacket', 5, 'White jacket', 1, 0, 0),
(28, 1, 7, 'jacket', 5, 'Red sweater', 1, 0, 0),
(29, 1, 20, 'jacket', 1, 'Blue jacket', 1, 0, 0),
(30, 1, 23, 'jacket', 2, 'Purple jacket', 1, 0, 0),
(31, 1, 24, 'jacket', 3, 'Red jacket', 1, 0, 0),
(32, 1, 35, 'jacket', 2, 'Blue jacket', 1, 0, 0),
(33, 1, 37, 'jacket', 2, 'Black & brown jacket', 1, 0, 0),
(34, 1, 46, 'jacket', 1, 'Blue coat', 1, 0, 0),
(35, 1, 59, 'jacket', 2, 'Black coat', 1, 1, 0),
(36, 1, 1, 'jeans', 0, 'Black jeans', 1, 0, 0),
(37, 1, 79, 'jeans', 0, 'Urban black jeans', 1, 0, 0),
(38, 1, 3, 'jeans', 0, 'White jeans', 1, 0, 0),
(39, 1, 4, 'jeans', 0, 'Black jeans', 1, 0, 0),
(40, 1, 1, 'shoes', 0, 'Black shoes', 2, 0, 0),
(41, 1, 42, 'shoes', 0, 'Grey shoes', 2, 0, 0),
(42, 1, 30, 'shoes', 0, 'Elegant grey shoes', 1, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `player_police_tickets`
--

CREATE TABLE `player_police_tickets` (
  `ticketID` int(11) NOT NULL,
  `ticketCop` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `ticketMember` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `ticketMemberSQL` int(11) NOT NULL DEFAULT '0',
  `ticketPrice` int(11) NOT NULL DEFAULT '0',
  `ticketReason` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `ticketStatus` int(11) NOT NULL DEFAULT '0',
  `ticketDate` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `player_transactions`
--

CREATE TABLE `player_transactions` (
  `transactionID` int(11) NOT NULL,
  `playerSQLID` int(11) NOT NULL,
  `playerAmount` int(11) NOT NULL DEFAULT '0',
  `transactionType` int(11) NOT NULL DEFAULT '0',
  `transactionDate` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'no date'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `server_business`
--

CREATE TABLE `server_business` (
  `businessID` int(11) NOT NULL,
  `businessOwner` varchar(50) NOT NULL DEFAULT 'AdmBot',
  `businessPrice` int(11) NOT NULL DEFAULT '0',
  `businessFee` int(11) NOT NULL DEFAULT '0',
  `businessBalance` int(11) NOT NULL DEFAULT '0',
  `businessDescription` varchar(200) NOT NULL DEFAULT 'no description',
  `businessIcon` int(11) NOT NULL DEFAULT '11',
  `businessType` int(11) NOT NULL DEFAULT '0',
  `businessInterior` int(11) NOT NULL DEFAULT '0',
  `businessVirtual` int(11) NOT NULL DEFAULT '0',
  `exitX` float NOT NULL DEFAULT '1.1',
  `exitY` float NOT NULL DEFAULT '1.1',
  `exitZ` float NOT NULL DEFAULT '1.1',
  `entX` float NOT NULL DEFAULT '1.1',
  `entY` float NOT NULL DEFAULT '1.1',
  `entZ` float NOT NULL DEFAULT '1.1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `server_business`
--

INSERT INTO `server_business` (`businessID`, `businessOwner`, `businessPrice`, `businessFee`, `businessBalance`, `businessDescription`, `businessIcon`, `businessType`, `businessInterior`, `businessVirtual`, `exitX`, `exitY`, `exitZ`, `entX`, `entY`, `entZ`) VALUES
(1, 'AdmBot', 0, 0, 0, '24/7', 11, 2, 0, 0, 1731.08, 6411.02, 35.001, 1729.44, 6415.33, 35.037),
(2, 'AdmBot', 0, 0, 0, 'Clothing Store', 366, 4, 0, 0, 127.136, -210.875, 54.5341, 125.568, -223.522, 54.5578),
(4, 'AdmBot', 0, 0, 0, 'Tunning', 446, 0, 0, 0, -354.697, -128.191, 39.4306, -336.109, -135.591, 38.6496),
(5, 'AdmBot', 0, 0, 0, 'Gun Shop', 11, 3, 0, 0, 17.1584, -1115.62, 29.7911, 21.1319, -1106.51, 29.797),
(6, 'AdmBot', 0, 0, 0, 'Gas Station', 11, 1, 0, 0, 167.053, -1553.4, 29.2617, 174.963, -1562.23, 29.2642);

-- --------------------------------------------------------

--
-- Table structure for table `server_characters`
--

CREATE TABLE `server_characters` (
  `ID` int(11) NOT NULL,
  `owner` int(11) NOT NULL,
  `gender` int(11) NOT NULL,
  `mother` int(11) NOT NULL,
  `father` int(11) NOT NULL,
  `skin` float NOT NULL,
  `hair` int(11) NOT NULL,
  `hairColor` int(11) NOT NULL,
  `eyeColor` int(11) NOT NULL,
  `eyeSize` float NOT NULL,
  `eyeBrow` float NOT NULL,
  `noseWidth` float NOT NULL,
  `noseHeight` float NOT NULL,
  `beard` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `server_characters`
--

INSERT INTO `server_characters` (`ID`, `owner`, `gender`, `mother`, `father`, `skin`, `hair`, `hairColor`, `eyeColor`, `eyeSize`, `eyeBrow`, `noseWidth`, `noseHeight`, `beard`) VALUES
(1, 1, 0, 21, 0, 0.5, 2, 0, 2, -1, 1, -1, -1, 3),
(2, 4, 0, 21, 0, 0.5, 0, 0, 0, 0, 1, -1, -1, 255),
(3, 5, 0, 26, 7, 0.5, 3, 0, 2, 0.9, -0.8, 0, 0, 3),
(4, 6, 0, 21, 0, 0.5, 0, 0, 0, 0, 0, 0, 0, 255);

-- --------------------------------------------------------

--
-- Table structure for table `server_dealership_vehicles`
--

CREATE TABLE `server_dealership_vehicles` (
  `dealerID` int(11) NOT NULL,
  `dealerModel` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Baller',
  `dealerPrice` int(11) NOT NULL DEFAULT '1000000',
  `dealerStock` int(11) NOT NULL DEFAULT '20',
  `dealerSpeed` int(11) NOT NULL DEFAULT '200'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `server_dealership_vehicles`
--

INSERT INTO `server_dealership_vehicles` (`dealerID`, `dealerModel`, `dealerPrice`, `dealerStock`, `dealerSpeed`) VALUES
(1, 'Shotaro', 1000000, 981, 200),
(2, 'Baller', 1000000, 18, 200),
(3, 'T20', 5000000, 7, 200);

-- --------------------------------------------------------

--
-- Table structure for table `server_groups`
--

CREATE TABLE `server_groups` (
  `groupID` int(11) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  `exitX` float NOT NULL DEFAULT '1.1',
  `exitY` float NOT NULL DEFAULT '1.1',
  `exitZ` float NOT NULL DEFAULT '1.1',
  `entX` float NOT NULL DEFAULT '1.1',
  `entY` float NOT NULL DEFAULT '1.1',
  `entZ` float NOT NULL DEFAULT '1.1',
  `entHead` float NOT NULL,
  `maxMembers` int(11) NOT NULL DEFAULT '15',
  `minLevel` int(11) NOT NULL DEFAULT '5',
  `groupType` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `server_groups`
--

INSERT INTO `server_groups` (`groupID`, `name`, `exitX`, `exitY`, `exitZ`, `entX`, `entY`, `entZ`, `entHead`, `maxMembers`, `minLevel`, `groupType`) VALUES
(1, 'Los Santos Police', 434.306, -981.978, 30.709, 447.031, -986.026, 30.689, 64.87, 15, 5, 0);

-- --------------------------------------------------------

--
-- Table structure for table `server_house`
--

CREATE TABLE `server_house` (
  `houseID` int(11) NOT NULL,
  `exitX` double NOT NULL DEFAULT '1.1',
  `exitY` double NOT NULL DEFAULT '1.1',
  `exitZ` double NOT NULL DEFAULT '1.1',
  `exitAngle` float NOT NULL DEFAULT '0',
  `entX` double NOT NULL DEFAULT '1.1',
  `entY` double NOT NULL DEFAULT '1.1',
  `entZ` double NOT NULL DEFAULT '1.1',
  `status` int(11) NOT NULL DEFAULT '0',
  `owner` varchar(100) NOT NULL DEFAULT 'AdmBot',
  `price` int(11) NOT NULL DEFAULT '0',
  `rentPrice` int(11) NOT NULL DEFAULT '500',
  `balance` int(11) NOT NULL DEFAULT '0',
  `description` varchar(200) NOT NULL DEFAULT 'no description'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `server_house`
--

INSERT INTO `server_house` (`houseID`, `exitX`, `exitY`, `exitZ`, `exitAngle`, `entX`, `entY`, `entZ`, `status`, `owner`, `price`, `rentPrice`, `balance`, `description`) VALUES
(1, -355.644, 458.148, 116.647, 311.417, 346.552490234375, -1012.7349853515625, -99.19619750976562, 1, 'AdmBot', 0, 0, 5000000, 'asdasdasdsad');

-- --------------------------------------------------------

--
-- Table structure for table `server_jobs`
--

CREATE TABLE `server_jobs` (
  `jobID` int(11) NOT NULL,
  `jobName` varchar(50) NOT NULL DEFAULT 'sema',
  `jobPosX` float NOT NULL DEFAULT '1.1',
  `jobPosY` float NOT NULL DEFAULT '1.1',
  `jobPosZ` float NOT NULL DEFAULT '1.1',
  `jobWorkX` float NOT NULL,
  `jobWorkY` float NOT NULL,
  `jobWorkZ` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `server_jobs`
--

INSERT INTO `server_jobs` (`jobID`, `jobName`, `jobPosX`, `jobPosY`, `jobPosZ`, `jobWorkX`, `jobWorkY`, `jobWorkZ`) VALUES
(1, 'Fisherman', -1845.02, -1195.58, 19.184, 0, 0, 0),
(2, 'Trucker', 764.835, -1358.77, 27.878, 719.912, -1369.56, 26.204),
(3, 'Farmer', 2243.35, 5154.08, 57.887, 2251.65, 5155.36, 57.887),
(4, 'Drugs dealer', 2213.96, 4778, 40.164, 2235.31, 4795.71, 39.956);

-- --------------------------------------------------------

--
-- Table structure for table `server_player_vehicles`
--

CREATE TABLE `server_player_vehicles` (
  `vehicleID` int(11) NOT NULL,
  `vehicleModel` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'T20',
  `vehicleOwner` int(11) NOT NULL DEFAULT '0',
  `vehicleOdometer` float NOT NULL DEFAULT '0',
  `vehicleNumber` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'B-02-NEW',
  `vehicleregDate` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'no date',
  `vehiclePosX` float NOT NULL DEFAULT '-1035.16',
  `vehiclePosY` float NOT NULL DEFAULT '-2729.86',
  `vehiclePosZ` float NOT NULL DEFAULT '19.631',
  `vehiclePosA` float NOT NULL DEFAULT '240.395',
  `vehicleStatus` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'true',
  `colorOne` int(10) NOT NULL DEFAULT '255',
  `colorTwo` int(10) NOT NULL DEFAULT '255',
  `colorThree` int(10) NOT NULL DEFAULT '255'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `server_rent_vehicles`
--

CREATE TABLE `server_rent_vehicles` (
  `rentID` int(11) NOT NULL,
  `rentModel` varchar(100) NOT NULL DEFAULT 'Infernus',
  `rentPrice` int(11) NOT NULL DEFAULT '1000000',
  `rentStock` int(11) NOT NULL DEFAULT '10'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `server_rent_vehicles`
--

INSERT INTO `server_rent_vehicles` (`rentID`, `rentModel`, `rentPrice`, `rentStock`) VALUES
(1, 'Infernus', 500000000, 4),
(2, 'Bullet', 5000000, 4),
(3, 'NRG - 500', 2040000, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `player_inventory`
--
ALTER TABLE `player_inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `player_police_tickets`
--
ALTER TABLE `player_police_tickets`
  ADD PRIMARY KEY (`ticketID`);

--
-- Indexes for table `player_transactions`
--
ALTER TABLE `player_transactions`
  ADD PRIMARY KEY (`transactionID`);

--
-- Indexes for table `server_business`
--
ALTER TABLE `server_business`
  ADD PRIMARY KEY (`businessID`);

--
-- Indexes for table `server_characters`
--
ALTER TABLE `server_characters`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `server_dealership_vehicles`
--
ALTER TABLE `server_dealership_vehicles`
  ADD PRIMARY KEY (`dealerID`);

--
-- Indexes for table `server_groups`
--
ALTER TABLE `server_groups`
  ADD PRIMARY KEY (`groupID`);

--
-- Indexes for table `server_house`
--
ALTER TABLE `server_house`
  ADD PRIMARY KEY (`houseID`);

--
-- Indexes for table `server_jobs`
--
ALTER TABLE `server_jobs`
  ADD PRIMARY KEY (`jobID`);

--
-- Indexes for table `server_player_vehicles`
--
ALTER TABLE `server_player_vehicles`
  ADD PRIMARY KEY (`vehicleID`);

--
-- Indexes for table `server_rent_vehicles`
--
ALTER TABLE `server_rent_vehicles`
  ADD PRIMARY KEY (`rentID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `player_inventory`
--
ALTER TABLE `player_inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `player_police_tickets`
--
ALTER TABLE `player_police_tickets`
  MODIFY `ticketID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `player_transactions`
--
ALTER TABLE `player_transactions`
  MODIFY `transactionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `server_business`
--
ALTER TABLE `server_business`
  MODIFY `businessID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `server_characters`
--
ALTER TABLE `server_characters`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `server_dealership_vehicles`
--
ALTER TABLE `server_dealership_vehicles`
  MODIFY `dealerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `server_groups`
--
ALTER TABLE `server_groups`
  MODIFY `groupID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `server_house`
--
ALTER TABLE `server_house`
  MODIFY `houseID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `server_jobs`
--
ALTER TABLE `server_jobs`
  MODIFY `jobID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `server_player_vehicles`
--
ALTER TABLE `server_player_vehicles`
  MODIFY `vehicleID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `server_rent_vehicles`
--
ALTER TABLE `server_rent_vehicles`
  MODIFY `rentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
