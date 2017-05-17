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
-- Table structure for table `tombstones`
--

CREATE TABLE IF NOT EXISTS `tombstones` (
  `count` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'when this entry was logged',
  `DOD` date NOT NULL COMMENT '(date of death) when (in the game) the family member passed (will be somewhere after March 1, 1848)',
  `name` text NOT NULL COMMENT 'first name of family member',
  `mile` smallint(6) NOT NULL COMMENT 'mile marker they passed',
  `message` varchar(140) DEFAULT NULL COMMENT 'message on tombstone',
  PRIMARY KEY (`count`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=42 ;

--
-- Dumping data for table `tombstones`
--

INSERT INTO `tombstones` (`count`, `timestamp`, `DOD`, `name`, `mile`, `message`) VALUES
(17, '2017-04-27 19:44:27', '1848-07-01', 'Rachel', 1691, 'Everyone died.'),
(19, '2017-04-28 19:04:49', '1848-05-27', 'Kayla', 1317, 'We really tried hard.'),
(20, '2017-04-28 21:58:34', '1848-04-09', 'Tim', 102, 'They were brave to the end.'),
(22, '2017-04-28 22:23:19', '1848-05-05', 'Aviva', 1087, 'They were not able to make it.'),
(24, '2017-04-30 20:00:05', '1848-06-14', 'Oliver', 457, 'we could not succeed'),
(27, '2017-05-14 00:02:15', '1848-08-14', 'Joe', 329, 'We tried very hard.'),
(30, '2017-05-14 00:28:50', '1848-05-13', 'Sam', 60, 'Can we put a tombstone here?'),
(39, '2017-05-15 00:14:44', '1848-06-09', 'Chris', 828, 'Requiescat In Pace');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
