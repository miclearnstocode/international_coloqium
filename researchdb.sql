-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 31, 2026 at 08:16 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `researchdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `abstract_submissions`
--

CREATE TABLE `abstract_submissions` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `selected_track` varchar(255) NOT NULL,
  `specific_track` varchar(255) NOT NULL,
  `research_title` varchar(500) NOT NULL,
  `author` varchar(255) NOT NULL,
  `co_author` text DEFAULT NULL,
  `presenter` varchar(255) NOT NULL,
  `email_address` varchar(100) NOT NULL,
  `university_agency` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `presentation_type` varchar(50) DEFAULT NULL,
  `city_tour_option` varchar(50) DEFAULT NULL,
  `abstract` text NOT NULL,
  `keywords` varchar(255) NOT NULL,
  `abstract_drive_view_url` varchar(500) DEFAULT NULL,
  `abstract_drive_download_url` varchar(500) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `abstract_submissions`
--

INSERT INTO `abstract_submissions` (`id`, `sender_id`, `user_id`, `selected_track`, `specific_track`, `research_title`, `author`, `co_author`, `presenter`, `email_address`, `university_agency`, `address`, `phone_number`, `presentation_type`, `city_tour_option`, `abstract`, `keywords`, `abstract_drive_view_url`, `abstract_drive_download_url`, `status`, `created_at`) VALUES
(1, 0, 0, 'Track 1 – Agriculture, Animal', 'Crop science and sustainable crop production', 'Pagtagam: A Narrative On The Traditional Knowledge And Practices On Disaster Riskreduction Of The Local Folks At Tapaz, Capiz, Philippines', 'Ronilo G. Berondo', 'Mang Juan', 'Juan Tamad', 'sample@gmail.com', 'Agusan del Sur State College of Agriculture and Technology', NULL, NULL, NULL, NULL, 'This study explored on Pagtagam: A Narrative on the Traditional Knowledge and Practiceson Disaster Risk Reduction of the Local Folks at Tapaz, Capiz, Philippines. Using the qualitativeresearch design, five (5) informants were purposively chosen. Data was collected using fieldwork, observations, interviews with key informants, and analysis of documents and photographs. Verbatimdata transcripts were analyzed using the approach by Flick (2018). This study aimed to document and record the local folks’ traditional knowledge on disaster risk reduction in Tapaz, Capiz, Philippines. This study also imparted the narratives of the local folksspecifically living in disaster prone areas such as San Nicolas, Candelaria, Santa Petronila, DaanBanwa, and Salong, so we may learn something from them. These narratives consist of thetraditional practices and techniques they employ for disaster risk reduction, the applicationof traditional knowledge and practices during times of hazards, and the effective measures of protectionagainst natural disasters. These practices include using environmental cues such as coconut leaves, mushrooms, tadpoles, chickens, and ants to predict and prepare for storms, typhoons, and floods. Building of kurob and lantay, planting of trees and bamboos, fortifying their homes and finding higher areas, storing food and necessities and evacuating as early as possible are some practices theyhave been doing to cope and protect themselves during natural disasters. Such traditional knowledge, passed down through generations, not only enhances community resilience but alsofosters a deeper connection between people and their environment.', 'hazards, indigenous wisdom, preparedness, resilience', 'https://drive.google.com/file/d/1H4tKbAHyYI4U18K8otkDtWTSdy9CWdN7/view', 'https://drive.google.com/uc?export=download&id=1H4tKbAHyYI4U18K8otkDtWTSdy9CWdN7', 'pending', '2026-08-28 14:03:46'),
(2, 1, 1, 'Track 2 – Life, Biological, and Biotechnology Sciences', 'Genetics and genomics', 'Sample research', 'Michael Estorque', 'Juan Carlos, Maria Dimacuha', 'Cardo Dalisay', 'michaelestorque14@gmail.com', 'Aklan State University', NULL, NULL, NULL, NULL, 'This study explored on Pagtagam: A Narrative on the Traditional Knowledge and Practiceson Disaster Risk Reduction of the Local Folks at Tapaz, Capiz, Philippines. Using the qualitativeresearch design, five (5) informants were purposively chosen. Data was collected using fieldwork, observations, interviews with key informants, and analysis of documents and photographs. Verbatimdata transcripts were analyzed using the approach by Flick (2018). This study aimed to document and record the local folks’ traditional knowledge on disaster risk reduction in Tapaz, Capiz, Philippines. This study also imparted the narratives of the local folksspecifically living in disaster prone areas such as San Nicolas, Candelaria, Santa Petronila, DaanBanwa, and Salong, so we may learn something from them. These narratives consist of thetraditional practices and techniques they employ for disaster risk reduction, the applicationof traditional knowledge and practices during times of hazards, and the effective measures of protectionagainst natural disasters. These practices include using environmental cues such as coconut leaves, mushrooms, tadpoles, chickens, and ants to predict and prepare for storms, typhoons, and floods. Building of kurob and lantay, planting of trees and bamboos, fortifying their homes and finding higher areas, storing food and necessities and evacuating as early as possible are some practices theyhave been doing to cope and protect themselves during natural disasters. Such traditional knowledge, passed down through generations, not only enhances community resilience but alsofosters a deeper connection between people and their environment.', 'hazards, indigenous wisdom, preparedness, resilience', 'https://drive.google.com/file/d/1XG6aW6deu9PNWvBi0GNEV4ulApRomZnM/view', 'https://drive.google.com/uc?export=download&id=1XG6aW6deu9PNWvBi0GNEV4ulApRomZnM', 'pending', '2026-08-28 14:34:31'),
(3, 1, 1, 'Track 1 – Agriculture, Animal', 'Animal science and livestock production', 'Pagtagam: A Narrative On The Traditional Knowledge And Practices On Disaster Riskreduction Of The Local Folks At Tapaz, Capiz, Philippines', 'Michael Estorque', '', 'Juan Tamad', 'michaelestorque14@gmail.com', 'Apayao State College', 'Fuentes Drive Roxas City Capiz', '09514808302', 'oral', 'option1', 'This study explored on Pagtagam: A Narrative on the Traditional Knowledge and Practiceson Disaster Risk Reduction of the Local Folks at Tapaz, Capiz, Philippines. Using the qualitativeresearch design, five (5) informants were purposively chosen. Data was collected using fieldwork, observations, interviews with key informants, and analysis of documents and photographs. Verbatimdata transcripts were analyzed using the approach by Flick (2018). This study aimed to document and record the local folks’ traditional knowledge on disaster risk reduction in Tapaz, Capiz, Philippines. This study also imparted the narratives of the local folksspecifically living in disaster prone areas such as San Nicolas, Candelaria, Santa Petronila, DaanBanwa, and Salong, so we may learn something from them. These narratives consist of thetraditional practices and techniques they employ for disaster risk reduction, the applicationof traditional knowledge and practices during times of hazards, and the effective measures of protectionagainst natural disasters. These practices include using environmental cues such as coconut leaves, mushrooms, tadpoles, chickens, and ants to predict and prepare for storms, typhoons, and floods. Building of kurob and lantay, planting of trees and bamboos, fortifying their homes and finding higher areas, storing food and necessities and evacuating as early as possible are some practices theyhave been doing to cope and protect themselves during natural disasters. Such traditional knowledge, passed down through generations, not only enhances community resilience but alsofosters a deeper connection between people and their environment.', 'hazards, indigenous wisdom, preparedness, resilience', 'https://drive.google.com/file/d/1J38H_9S6rJvNdpFxk1mvXVrVJPH8Fwdj/view', 'https://drive.google.com/uc?export=download&id=1J38H_9S6rJvNdpFxk1mvXVrVJPH8Fwdj', 'pending', '2026-08-31 02:53:43');

-- --------------------------------------------------------

--
-- Table structure for table `sucs`
--

CREATE TABLE `sucs` (
  `id` int(11) NOT NULL,
  `region` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `abbreviation` varchar(50) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sucs_agency`
--

CREATE TABLE `sucs_agency` (
  `id` int(11) NOT NULL,
  `region` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `abbreviation` varchar(50) DEFAULT NULL,
  `type` enum('University','College','Institute','Academy','Technological University','State College','Polytechnic College','Marine Academy') DEFAULT 'University',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sucs_agency`
--

INSERT INTO `sucs_agency` (`id`, `region`, `name`, `abbreviation`, `type`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'National', 'University of the Philippines System', 'UP', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(2, 'NCR', 'Eulogio \"Amang\" Rodriguez Institute of Science and Technology', 'EARIST', 'Institute', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(3, 'NCR', 'Marikina Polytechnic College', 'MPC', 'Polytechnic College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(4, 'NCR', 'Philippine Normal University', 'PNU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(5, 'NCR', 'National Aviation Academy of the Philippines', 'NAAP', 'Academy', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(6, 'NCR', 'Polytechnic University of the Philippines', 'PUP', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(7, 'NCR', 'Rizal Technological University', 'RTU', 'Technological University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(8, 'NCR', 'Technological University of the Philippines', 'TUP', 'Technological University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(9, 'Region I – Ilocos', 'Don Mariano Marcos Memorial State University', 'DMMMSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(10, 'Region I – Ilocos', 'Ilocos Sur Polytechnic State College', 'ISPSC', 'Polytechnic College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(11, 'Region I – Ilocos', 'Mariano Marcos State University', 'MMSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(12, 'Region I – Ilocos', 'Pangasinan State University', 'PSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(13, 'Region I – Ilocos', 'University of Northern Philippines', 'UNP', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(14, 'CAR', 'Abra State Institute of Sciences and Technology', 'ASIST', 'Institute', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(15, 'CAR', 'Apayao State College', 'ASC', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(16, 'CAR', 'Benguet State University', 'BSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(17, 'CAR', 'Ifugao State University', 'IFSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(18, 'CAR', 'Kalinga State University', 'KSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(19, 'CAR', 'Mountain Province State University', 'MPSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(20, 'Region II – Cagayan Valley', 'Batanes State College', 'BSC', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(21, 'Region II – Cagayan Valley', 'Cagayan State University', 'CSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(22, 'Region II – Cagayan Valley', 'Isabela State University', 'ISU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(23, 'Region II – Cagayan Valley', 'Nueva Vizcaya State University', 'NVSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(24, 'Region II – Cagayan Valley', 'Quirino State University', 'QSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(25, 'Region III – Central Luzon', 'Aurora State College of Technology', 'ASCOT', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(26, 'Region III – Central Luzon', 'Bataan Peninsula State University', 'BPSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(27, 'Region III – Central Luzon', 'Bulacan Agricultural State College', 'BASC', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(28, 'Region III – Central Luzon', 'Bulacan State University', 'BulSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(29, 'Region III – Central Luzon', 'Central Luzon State University', 'CLSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(30, 'Region III – Central Luzon', 'Nueva Ecija University of Science and Technology', 'NEUST', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(31, 'Region III – Central Luzon', 'Pampanga State Agricultural University', 'PSAU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(32, 'Region III – Central Luzon', 'Pampanga State University', 'PSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(33, 'Region III – Central Luzon', 'Philippine Merchant Marine Academy', 'PMMA', 'Marine Academy', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(34, 'Region III – Central Luzon', 'President Ramon Magsaysay University', 'PRMSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(35, 'Region III – Central Luzon', 'Tarlac Agricultural University', 'TAU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(36, 'Region III – Central Luzon', 'Tarlac State University', 'TSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(37, 'Region IV-A – CALABARZON', 'Batangas State University', 'BatStateU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(38, 'Region IV-A – CALABARZON', 'Cavite State University', 'CvSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(39, 'Region IV-A – CALABARZON', 'Laguna State Polytechnic University', 'LSPU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(40, 'Region IV-A – CALABARZON', 'Southern Luzon State University', 'SLSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(41, 'Region IV-A – CALABARZON', 'University of Rizal System', 'URS', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(42, 'Region IV-B – MIMAROPA', 'Marinduque State University', 'MarSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(43, 'Region IV-B – MIMAROPA', 'Mindoro State University', 'MinSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(44, 'Region IV-B – MIMAROPA', 'Occidental Mindoro State College', 'OMSC', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(45, 'Region IV-B – MIMAROPA', 'Palawan State University', 'PSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(46, 'Region IV-B – MIMAROPA', 'Romblon State University', 'RSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(47, 'Region IV-B – MIMAROPA', 'Western Philippines University', 'WPU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(48, 'Region V – Bicol', 'Bicol State College of Applied Sciences and Technology', 'BISCAST', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(49, 'Region V – Bicol', 'Bicol University', 'BU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(50, 'Region V – Bicol', 'Camarines Norte State College', 'CNSC', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(51, 'Region V – Bicol', 'Camarines Sur Polytechnic Colleges', 'CSPC', 'Polytechnic College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(52, 'Region V – Bicol', 'Catanduanes State University', 'CatSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(53, 'Region V – Bicol', 'Central Bicol State University of Agriculture', 'CBSUA', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(54, 'Region V – Bicol', 'Dr. Emilio B. Espinosa, Sr. Memorial State College of Agriculture and Technology', 'DEBESMSCAT', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(55, 'Region V – Bicol', 'Partido State University', 'ParSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(56, 'Region V – Bicol', 'Sorsogon State University', 'SorSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(57, 'Region VI – Western Visayas', 'Aklan State University', 'ASU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(58, 'Region VI – Western Visayas', 'Capiz State University', 'CapSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(59, 'Region VI – Western Visayas', 'Guimaras State University', 'GSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(60, 'Region VI – Western Visayas', 'Iloilo Science and Technology University', 'ISAT-U', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(61, 'Region VI – Western Visayas', 'Iloilo State University of Fisheries Science and Technology', 'ISUFST', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(62, 'Region VI – Western Visayas', 'Northern Iloilo State University', 'NISU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(63, 'Region VI – Western Visayas', 'University of Antique', 'UA', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(64, 'Region VI – Western Visayas', 'West Visayas State University', 'WVSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(65, 'Negros Island Region (NIR)', 'Carlos Hilado Memorial State University', 'CHMSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(66, 'Negros Island Region (NIR)', 'Central Philippines State University', 'CPSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(67, 'Negros Island Region (NIR)', 'Negros Oriental State University', 'NORSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(68, 'Negros Island Region (NIR)', 'Siquijor State College', 'SSC', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(69, 'Negros Island Region (NIR)', 'State University of Northern Negros', 'SUNN', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(70, 'Region VII – Central Visayas', 'Bohol Island State University', 'BISU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(71, 'Region VII – Central Visayas', 'Cebu Normal University', 'CNU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(72, 'Region VII – Central Visayas', 'Cebu Technological University', 'CTU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(73, 'Region VIII – Eastern Visayas', 'Biliran Province State University', 'BiPSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(74, 'Region VIII – Eastern Visayas', 'Eastern Samar State University', 'ESSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(75, 'Region VIII – Eastern Visayas', 'Eastern Visayas State University', 'EVSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(76, 'Region VIII – Eastern Visayas', 'Leyte Normal University', 'LNU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(77, 'Region VIII – Eastern Visayas', 'Northwest Samar State University', 'NwSSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(78, 'Region VIII – Eastern Visayas', 'Palompon Institute of Technology', 'PIT', 'Institute', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(79, 'Region VIII – Eastern Visayas', 'Samar State University', 'SSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(80, 'Region VIII – Eastern Visayas', 'Southern Leyte State University', 'SLSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(81, 'Region VIII – Eastern Visayas', 'University of Eastern Philippines', 'UEP', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(82, 'Region VIII – Eastern Visayas', 'Visayas State University', 'VSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(83, 'Region IX – Zamboanga Peninsula', 'Basilan State College', 'BSC', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(84, 'Region IX – Zamboanga Peninsula', 'J.H. Cerilles State College', 'JHCSC', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(85, 'Region IX – Zamboanga Peninsula', 'Jose Rizal Memorial State University', 'JRMSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(86, 'Region IX – Zamboanga Peninsula', 'Western Mindanao State University', 'WMSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(87, 'Region IX – Zamboanga Peninsula', 'Zamboanga Peninsula Polytechnic State University', 'ZPPSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(88, 'Region IX – Zamboanga Peninsula', 'Zamboanga State College of Marine Sciences and Technology', 'ZSCMST', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(89, 'Region X – Northern Mindanao', 'Bukidnon State University', 'BSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(90, 'Region X – Northern Mindanao', 'Camiguin Polytechnic State College', 'CPSC', 'Polytechnic College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(91, 'Region X – Northern Mindanao', 'Central Mindanao University', 'CMU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(92, 'Region X – Northern Mindanao', 'MSU – Iligan Institute of Technology', 'MSU-IIT', 'Institute', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(93, 'Region X – Northern Mindanao', 'Northern Bukidnon State College', 'NBSC', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(94, 'Region X – Northern Mindanao', 'Northwestern Mindanao State College of Science and Technology', 'NMSCST', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(95, 'Region X – Northern Mindanao', 'University of Science and Technology of Southern Philippines', 'USTP', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(96, 'Region XI – Davao', 'Davao de Oro State College', 'DDOSC', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(97, 'Region XI – Davao', 'Davao del Norte State College', 'DNSC', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(98, 'Region XI – Davao', 'Davao del Sur State College', 'DSSC', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(99, 'Region XI – Davao', 'Davao Oriental State University', 'DOrSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(100, 'Region XI – Davao', 'Southern Philippines Agri-Business, Marine and Aquatic School of Technology', 'SPAMAST', '', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(101, 'Region XI – Davao', 'University of Southeastern Philippines', 'USeP', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(102, 'Region XII – SOCCSKSARGEN', 'Cotabato Foundation College of Science and Technology', 'CFCST', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(103, 'Region XII – SOCCSKSARGEN', 'South Cotabato State College', 'SCSC', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(104, 'Region XII – SOCCSKSARGEN', 'Sultan Kudarat State University', 'SKSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(105, 'Region XII – SOCCSKSARGEN', 'University of Southern Mindanao', 'USM', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(106, 'Region XIII – CARAGA', 'Agusan del Sur State College of Agriculture and Technology', 'ASSCAT', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(107, 'Region XIII – CARAGA', 'Caraga State University', 'CarSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(108, 'Region XIII – CARAGA', 'North Eastern Mindanao State University', 'NEMSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(109, 'Region XIII – CARAGA', 'Surigao del Norte State University', 'SNSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(110, 'BARMM', 'Adiong Memorial State College', 'AMSC', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(111, 'BARMM', 'Cotabato State University', 'CSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(112, 'BARMM', 'Mindanao State University', 'MSU', 'University', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(113, 'BARMM', 'MSU–Tawi-Tawi College of Technology and Oceanography', 'MSU-TCTO', 'College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(114, 'BARMM', 'Sulu State College', 'SSC', 'State College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34'),
(115, 'BARMM', 'Tawi-Tawi Regional Agricultural College', 'TRAC', 'College', 1, '2026-08-28 07:12:34', '2026-08-28 07:12:34');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('user','staff') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'Michael Estorque', 'mmestorque@capsu.edu.ph', '$2b$12$nYX52TCVFln8KXFtNa.LG.xdSw0QcQ7EZ0Ml3r6o5D.uGJdmRLFpq', 'user', '2026-08-28 07:33:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `abstract_submissions`
--
ALTER TABLE `abstract_submissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sucs`
--
ALTER TABLE `sucs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `sucs_agency`
--
ALTER TABLE `sucs_agency`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_region` (`region`),
  ADD KEY `idx_name` (`name`),
  ADD KEY `idx_type` (`type`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `abstract_submissions`
--
ALTER TABLE `abstract_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sucs`
--
ALTER TABLE `sucs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sucs_agency`
--
ALTER TABLE `sucs_agency`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
