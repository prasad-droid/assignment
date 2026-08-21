-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 22, 2026 at 12:43 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXIST leadmanagement

--
-- Database: `leadmanagement`
--

CREATE TABLE `leads` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `company` varchar(160) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `email` varchar(254) NOT NULL,
  `category` enum('Innerwear','Sportswear','Comfortwear','Fabric','Accessories','OEM/ODM') NOT NULL DEFAULT 'Innerwear',
  `lead_status` enum('New','Contacted','Follow-up','Converted','Not Interested') NOT NULL DEFAULT 'New',
  `follow_up_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



INSERT INTO `leads` (`id`, `name`, `company`, `mobile`, `email`, `category`, `lead_status`, `follow_up_date`, `created_at`, `updated_at`) VALUES
(1, 'Aarav Sharma', 'Zenith Apparels', '+91 98765 43210', 'aarav@zenithapparels.com', 'Sportswear', 'Contacted', '2026-08-26', '2026-08-21 19:24:40', '2026-08-21 22:19:13'),
(3, 'Rohan Mehta', 'Flexifit Garments', '+91 99887 76655', 'rohan@flexifit.co', 'OEM/ODM', 'Follow-up', '2026-08-22', '2026-08-09 19:24:40', '2026-08-21 19:24:40'),
(4, 'Sneha Kulkarni', 'UrbanThread Co', '+91 90909 80807', 'sneha@urbanthread.com', 'Comfortwear', 'Follow-up', '2026-08-19', '2026-08-01 19:24:40', '2026-08-21 19:24:40'),
(5, 'Vikram Singh', 'Prime Innerwear Ltd', '+91 98111 22334', 'vikram@primeinnerwear.com', 'Innerwear', 'Converted', NULL, '2026-07-07 19:24:40', '2026-08-21 19:24:40'),
(6, 'Ananya Iyer', 'Bloom Retail', '+91 97654 32109', 'ananya@bloomretail.in', 'Accessories', 'Not Interested', NULL, '2026-07-22 19:24:40', '2026-08-21 19:24:40'),
(7, 'Karan Patel', 'Stride Sports', '+91 95555 44433', 'karan@stridesports.com', 'Sportswear', 'New', NULL, '2026-08-18 19:24:40', '2026-08-21 19:24:40'),
(8, 'Meera Joshi', 'CottonCloud', '+91 93456 78901', 'meera@cottoncloud.io', 'Comfortwear', 'Contacted', '2026-08-27', '2026-08-06 19:24:40', '2026-08-21 19:24:40'),
(9, 'Arjun Reddy', 'Vertex Accessories', '+91 94455 66778', 'arjun@vertexacc.com', 'Accessories', 'Follow-up', '2026-08-21', '2026-07-27 19:24:40', '2026-08-21 19:24:40');


ALTER TABLE `leads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_leads_status` (`lead_status`),
  ADD KEY `idx_leads_category` (`category`),
  ADD KEY `idx_leads_followup` (`follow_up_date`);


ALTER TABLE `leads`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

