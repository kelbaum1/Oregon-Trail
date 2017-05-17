-- phpMyAdmin SQL Dump
-- version 4.0.10.19
-- https://www.phpmyadmin.net
--
-- Host: studentdb-maria.gl.umbc.edu
-- Generation Time: May 16, 2017 at 10:20 PM
-- Server version: 10.1.22-MariaDB
-- PHP Version: 5.4.44

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `mansha1`
--

-- --------------------------------------------------------

--
-- Table structure for table `high_score`
--

CREATE TABLE IF NOT EXISTS `high_score` (
  `score_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Unique ID of high score',
  `username` varchar(20) NOT NULL COMMENT 'username of game player',
  `points` int(10) unsigned NOT NULL COMMENT 'score',
  `rating` enum('Greenhorn','Adventurer','Trail Guide') NOT NULL COMMENT 'rating of high score',
  PRIMARY KEY (`score_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=54 ;

--
-- Dumping data for table `high_score`
--

INSERT INTO `high_score` (`score_id`, `username`, `points`, `rating`) VALUES
(1, 'Michael', 300, 'Greenhorn'),
(2, 'Mansi', 5000, 'Trail Guide'),
(3, 'John', 6000, 'Adventurer'),
(4, 'Chris', 700, 'Greenhorn'),
(5, 'Rachel', 200, 'Greenhorn'),
(6, 'Zach', 550, 'Trail Guide'),
(7, 'Charlie', 800, 'Adventurer'),
(8, 'Alyssa', 850, 'Trail Guide'),
(9, 'Liam', 1000, 'Adventurer'),
(10, 'Sean', 200, 'Greenhorn'),
(11, 'Kayla', 4000, 'Trail Guide'),
(12, 'Celeste', 2500, 'Adventurer'),
(13, 'Sarah', 3500, 'Adventurer'),
(14, 'Nathan', 100, 'Adventurer'),
(15, 'Charles', 5, 'Adventurer'),
(16, 'Jones', 2500, 'Trail Guide'),
(50, 'Chris', 0, 'Greenhorn'),
(51, 'Chris', 0, 'Greenhorn'),
(52, 'Chris', 0, 'Greenhorn'),
(53, 'Steve', 1698, 'Greenhorn');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
