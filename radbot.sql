-- --------------------------------------------------------
-- Hôte:                         localhost
-- Version du serveur:           11.1.2-MariaDB-1:11.1.2+maria~ubu2204 - mariadb.org binary distribution
-- SE du serveur:                debian-linux-gnu
-- HeidiSQL Version:             12.5.0.6677
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE radbot;

-- Listage de la structure de la table radbot. files
CREATE TABLE IF NOT EXISTS `files` (
  `uploader_id` varchar(21) NOT NULL,
  `name` tinytext NOT NULL,
  `original_name` tinytext NOT NULL,
  `link_guilds` text NOT NULL DEFAULT '[]',
  `uploaded_at` datetime NOT NULL DEFAULT current_timestamp(),
  `edited_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`uploader_id`,`name`(100)) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
