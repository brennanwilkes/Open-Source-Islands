-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 12, 2020 at 05:18 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `osi`
--



CREATE OR REPLACE DATABASE osi CHARACTER SET = 'utf8' COLLATE = 'utf8_general_ci';
  
CREATE USER 'osi' IDENTIFIED BY 'az5DyRgaF2hxll2p';

GRANT USAGE ON *.* TO 'osi'@'localhost' IDENTIFIED BY 'az5DyRgaF2hxll2p';

GRANT SELECT ON `osi`.* TO 'osi'@'localhost';
GRANT DELETE ON `osi`.* TO 'osi'@'localhost';
GRANT UPDATE ON `osi`.* TO 'osi'@'localhost';
GRANT INSERT ON `osi`.* TO 'osi'@'localhost';
FLUSH PRIVILEGES;

SHOW GRANTS FOR 'osi'@'localhost';




-- --------------------------------------------------------

--
-- Table structure for table `islands`
--

USE `osi`

CREATE TABLE `islands` (
  `id` int(11) NOT NULL,
  `seed` double NOT NULL,
  `name` text NOT NULL,
  `colour_background` tinyint(1) NOT NULL,
  `deep_ocean` varchar(7) NOT NULL,
  `shallow_ocean` varchar(7) NOT NULL,
  `land_one` varchar(7) NOT NULL,
  `land_two` varchar(7) NOT NULL,
  `land_three` varchar(7) NOT NULL,
  `beach` varchar(7) NOT NULL,
  `rock_one` varchar(7) NOT NULL,
  `rock_two` varchar(7) NOT NULL,
  `lava_one` varchar(7) NOT NULL,
  `lava_two` varchar(7) NOT NULL,
  `village` varchar(7) NOT NULL,
  `sunset` int(11) NOT NULL,
  `has_motu` tinyint(1) NOT NULL,
  `has_reef` tinyint(1) NOT NULL,
  `is_volcano` tinyint(1) NOT NULL,
  `has_town` int(11) NOT NULL,
  `has_trees` tinyint(1) NOT NULL,
  `tree_amt` int(11) NOT NULL,
  `isl_persist` float NOT NULL,
  `isl_lac` float NOT NULL,
  `isl_scale` float NOT NULL,
  `image_data` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `islands`
--
ALTER TABLE `islands`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `islands`
--
ALTER TABLE `islands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
