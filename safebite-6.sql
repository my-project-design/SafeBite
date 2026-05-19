-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 19, 2026 at 10:52 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `safebite`
--

-- --------------------------------------------------------

--
-- Table structure for table `alternative`
--

CREATE TABLE `alternative` (
  `alternative_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `health_category_id` varchar(50) NOT NULL,
  `recipe_name` varchar(50) NOT NULL,
  `instruction` text NOT NULL,
  `ingredients` text NOT NULL,
  `reason` varchar(500) NOT NULL,
  `calories` int(11) NOT NULL,
  `created_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alternative`
--

INSERT INTO `alternative` (`alternative_id`, `product_id`, `health_category_id`, `recipe_name`, `instruction`, `ingredients`, `reason`, `calories`, `created_at`) VALUES
(1, 5, '1', 'Crispy Baked Sweet Potato Chips', 'Preheat oven to 180°C (350°F).\r\n\r\nWash and thinly slice sweet potato (very thin slices = more crispy).\r\n\r\nIn a bowl, mix slices with olive oil and spices.\r\n\r\nSpread on baking tray (single layer).\r\n\r\nBake for 15–20 minutes, flip halfway.\r\n\r\nBake until crispy but not burnt.\r\n\r\nLet cool for 5 minutes (they become crispier).', '1 medium sweet potato (thinly sliced)\r\n\r\n1 teaspoon olive oil\r\n\r\n½ teaspoon paprika\r\n\r\n¼ teaspoon black pepper\r\n\r\n¼ teaspoon garlic powder\r\n\r\nPinch of salt (very small amount)\r\n\r\nOptional: cinnamon (helps blood sugar control)', 'Oven baked\r\nLow salt', 150, '2026-03-03'),
(2, 6, '2', 'Quinoa Vegetable Bowl', 'Rinse quinoa well under water.\r\n\r\nBoil 2 cups water, add quinoa, cook 12–15 minutes until soft.\r\n\r\nSteam broccoli and carrot for 5–7 minutes (keep slightly crunchy).\r\n\r\nIn a bowl, add cooked quinoa.\r\n\r\nAdd spinach (fresh), steamed vegetables, and cucumber.\r\n\r\nMix olive oil, lemon juice, garlic, and pepper.\r\n\r\nPour dressing over bowl and mix well.\r\n\r\nServe warm or room temperature.', '1 cup quinoa (rinsed)\r\n\r\n2 cups water\r\n\r\n½ cup broccoli (chopped)\r\n\r\n½ cup spinach\r\n\r\n½ cup carrot (sliced)\r\n\r\n½ cup cucumber (chopped)\r\n\r\n1 teaspoon olive oil\r\n\r\n1 tablespoon lemon juice\r\n\r\n1 clove garlic (minced)\r\n\r\n¼ teaspoon black pepper\r\n\r\nPinch of salt (optional, very little)', 'Low Sodium \r\n\r\nHeart Friendly', 320, '2026-03-03'),
(3, 7, '3', 'Lentil Vegetable Soup', 'Heat olive oil in a pot.\r\n\r\nAdd garlic and sauté lightly.\r\n\r\nAdd lentils, vegetables, turmeric, and water.\r\n\r\nCook 15–20 minutes until soft.\r\n\r\nAdd black pepper.\r\n\r\nServe warm.', '½ cup red lentils (masoor dal)\r\n\r\n1 cup chopped spinach\r\n\r\n½ cup carrot (chopped)\r\n\r\n½ cup tomato (fresh)\r\n\r\n1 clove garlic\r\n\r\n1 teaspoon olive oil\r\n\r\n2 cups water\r\n\r\nBlack pepper\r\n\r\nTurmeric\r\n\r\nVery little salt (optional)', 'Plant protein\r\nHigh fiber', 220, '2026-03-03'),
(4, 8, '3', 'Chickpea Cucumber Salad', 'Mix chickpeas and vegetables in a bowl.\r\n\r\nAdd lemon juice, olive oil, and pepper.\r\n\r\nMix well and serve fresh.', '1 cup boiled chickpeas\r\n\r\n½ cup cucumber\r\n\r\n½ cup tomato\r\n\r\n1 tablespoon lemon juice\r\n\r\n1 teaspoon olive oil\r\n\r\nBlack pepper\r\n\r\nFresh coriander', 'High fiber\r\nNo processed ingredients', 280, '2026-03-03'),
(5, 9, '2', 'Stir-Fried Tofu & Vegetables', 'Heat olive oil in pan.\r\n\r\nAdd garlic and tofu (cook 3–4 mins).\r\n\r\nAdd vegetables and stir fry 5–6 mins.\r\n\r\nAdd pepper and lemon.\r\n\r\nAvoid soy sauce (high sodium).', '100g firm tofu\r\n\r\n½ cup broccoli\r\n\r\n½ cup bell pepper\r\n\r\n½ cup zucchini\r\n\r\n1 teaspoon olive oil\r\n\r\nGarlic\r\n\r\nBlack pepper\r\n\r\nLemon juice', 'High plant protein\r\n\r\nLow carb', 230, '2026-03-02'),
(6, 15, '1', 'Oats & Vegetable Upma', 'Dry roast oats 2–3 mins.\r\n\r\nHeat oil, add mustard seeds and vegetables.\r\n\r\nAdd 1 cup water and cook vegetables.\r\n\r\nAdd oats and cook until soft.\r\n\r\nServe warm.', '½ cup rolled oats\r\n\r\n½ cup carrot\r\n\r\n½ cup beans\r\n\r\n½ cup peas\r\n\r\n1 teaspoon olive oil\r\n\r\nMustard seeds\r\n\r\nCurry leaves\r\n\r\nBlack pepper', 'Oats help control blood sugar\r\n\r\nHigh fiber', 250, '2026-03-01');

-- --------------------------------------------------------

--
-- Table structure for table `bmicategory`
--

CREATE TABLE `bmicategory` (
  `Bmi_category_id` int(11) NOT NULL,
  `Category_name` varchar(50) NOT NULL,
  `Min_bmi` float NOT NULL,
  `Max_bmi` float NOT NULL,
  `Description` text NOT NULL,
  `Created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bmicategory`
--

INSERT INTO `bmicategory` (`Bmi_category_id`, `Category_name`, `Min_bmi`, `Max_bmi`, `Description`, `Created_at`) VALUES
(1, 'Normal', 18, 24, 'Normal for you ', '2026-03-04 18:59:54'),
(2, 'Overweight', 25, 29, 'Overweight ', '2023-04-01 00:00:00'),
(3, 'UnderWeight', 0, 18, 'Not good as you are underweight ', '2023-04-01 00:00:00'),
(4, 'Obese', 30, 35, 'Obese ', '2026-03-04 19:02:26');

-- --------------------------------------------------------

--
-- Table structure for table `brand`
--

CREATE TABLE `brand` (
  `Brand_id` int(11) NOT NULL,
  `Brand_name` varchar(150) NOT NULL,
  `Description` text NOT NULL,
  `Logo_url` text NOT NULL,
  `Status` enum('active','inactive') NOT NULL,
  `Created_at` date NOT NULL,
  `Updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brand`
--

INSERT INTO `brand` (`Brand_id`, `Brand_name`, `Description`, `Logo_url`, `Status`, `Created_at`, `Updated_at`) VALUES
(4, 'Maggie', 'You Eat Moto', '1772353588429.webp', 'active', '2023-04-01', '2023-04-01 00:00:00'),
(5, 'PepsiCo', 'Good Brand for drinks ', 'https://www.google.com/imgres?q=Pepsi%20logo&imgurl=https%3A%2F%2Fwww.transparentpng.com%2Fdownload%2Fpepsi%2FkCMfmS-pepsi-logo-simple-png.png&imgrefurl=https%3A%2F%2Fwww.transparentpng.com%2Fdetails%2Fpepsi-logo-simple-_15957.html&docid=MFP-HY5aYPoh7M&tbnid=rihNkr0L88-sfM&vet=12ahUKEwj3_NHXqIaTAxXRqWMGHah4AI4QnPAOegQIaBAB..i&w=2600&h=2136&hcb=2&ved=2ahUKEwj3_NHXqIaTAxXRqWMGHah4AI4QnPAOegQIaBAB', 'active', '2026-03-03', '2026-03-04 14:09:30'),
(6, 'Mondelez', 'Good for Biscuits', 'https://www.google.com/imgres?q=mondelez%20logo&imgurl=https%3A%2F%2Fcdn.prod.website-files.com%2F63c140cca12dc30690fce304%2F65e1d746ae1ebd39382a8999_Mondel%25C4%2593z%2520International.svg&imgrefurl=https%3A%2F%2Fwww.smarte.pro%2Fcompany%2Fmondelez-international&docid=AxnA9WOBZNLFvM&tbnid=ky0d20-HpXxlDM&vet=12ahUKEwikraWGqYaTAxV4jGMGHfR_AjwQnPAOegQIGhAB..i&w=1667&h=1046&hcb=2&ved=2ahUKEwikraWGqYaTAxV4jGMGHfR_AjwQnPAOegQIGhAB', 'active', '2026-03-01', '2026-03-04 14:11:06'),
(7, 'Coca-Cola Co', 'Good for Drinking brand.', 'https://www.google.com/imgres?q=Coca-Cola%20logo&imgurl=https%3A%2F%2Fi.etsystatic.com%2F24845246%2Fr%2Fil%2F21ec1a%2F4327682543%2Fil_fullxfull.4327682543_7f6s.jpg&imgrefurl=https%3A%2F%2Fwww.etsy.com%2Fin-en%2Flisting%2F1317584710%2Fcoca-cola-sign-logo-sign-shelf-display&docid=cfQAC91AgDQtiM&tbnid=82GNmM_9ZU7VSM&vet=12ahUKEwjLh_6eqYaTAxXoyzgGHYiJNJYQnPAOegUIiQEQAQ..i&w=3000&h=2250&hcb=2&ved=2ahUKEwjLh_6eqYaTAxXoyzgGHYiJNJYQnPAOegUIiQEQAQ', 'inactive', '2026-03-01', '2026-03-04 14:12:23'),
(8, 'Nestl`e', 'Good For instant food.', 'https://en.wikipedia.org/wiki/Nestl%C3%A9', 'active', '2026-03-12', '2026-03-04 14:13:39'),
(9, 'Amul ', 'This is a dairy brand.', 'https://www.google.com/imgres?q=Amul%20logo&imgurl=https%3A%2F%2Flookaside.fbsbx.com%2Flookaside%2Fcrawler%2Finstagram%2FC9zO9fbSZNs%2F0%2Fimage.jpg&imgrefurl=https%3A%2F%2Fwww.instagram.com%2Fpopular%2Famul-logo%2F&docid=3q9ggtCx5RSKiM&tbnid=jKTM6SI-DXJuAM&vet=12ahUKEwjU48jBq4aTAxWB2TgGHaxTGoYQnPAOegQIGRAB..i&w=360&h=640&hcb=2&ved=2ahUKEwjU48jBq4aTAxWB2TgGHaxTGoYQnPAOegQIGRAB', 'active', '2026-03-01', '2026-03-04 14:22:40'),
(10, 'Sugam', 'This is also for dairy brand.', 'https://www.google.com/imgres?q=Sugam%20logo&imgurl=https%3A%2F%2Fplay-lh.googleusercontent.com%2FHBaoVjGkkm5JEGud1ythCHFrqwzuk33a6wCwDctp4umxKSApx9Fee8bsM0TLNU-jFA&imgrefurl=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Ditemorder.softcom.bd.bdsugamitemorder%26hl%3Den_ZA&docid=_ruKCSdlB9hVDM&tbnid=1-t1mA6zmYs0SM&vet=12ahUKEwj944bgq4aTAxXnhGMGHQxzFwUQnPAOegQIGxAB..i&w=512&h=512&hcb=2&ved=2ahUKEwj944bgq4aTAxXnhGMGHQxzFwUQnPAOegQIGxAB', 'active', '2026-03-01', '2026-03-04 14:23:22');

-- --------------------------------------------------------

--
-- Table structure for table `Category`
--

CREATE TABLE `Category` (
  `Category_id` int(11) NOT NULL,
  `Category_name` varchar(100) NOT NULL,
  `Created_on` date NOT NULL,
  `Updated_on` date NOT NULL,
  `Updated_by` int(11) NOT NULL,
  `Created_by` int(11) NOT NULL,
  `Is_active` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Category`
--

INSERT INTO `Category` (`Category_id`, `Category_name`, `Created_on`, `Updated_on`, `Updated_by`, `Created_by`, `Is_active`) VALUES
(6, 'Snacks & Sweets', '2026-03-04', '2026-03-04', 1, 1, 1),
(7, 'Beverages', '2026-03-04', '2026-03-04', 1, 1, 1),
(8, 'Instant Food ', '2026-03-04', '2026-03-04', 1, 1, 1),
(9, 'Dairy', '2026-03-04', '2026-03-04', 1, 1, 1),
(10, 'Frozen Products', '2026-03-04', '2026-03-04', 1, 1, 1),
(11, 'Frozen Products', '2026-03-04', '2026-03-04', 1, 1, 1),
(12, 'Preserved Foods', '2026-03-04', '2026-03-04', 1, 1, 1),
(13, 'Ready to Eat', '2026-03-04', '2026-03-04', 1, 1, 1),
(14, 'Cooking Essentials', '2026-03-04', '2026-03-04', 1, 1, 1),
(15, 'Miscellaneous ', '2026-03-04', '2026-03-04', 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Health_category`
--

CREATE TABLE `Health_category` (
  `Health_category_id` int(11) NOT NULL,
  `Category_name` varchar(100) NOT NULL,
  `Description` text NOT NULL,
  `Is_active` text NOT NULL,
  `Created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Health_category`
--

INSERT INTO `Health_category` (`Health_category_id`, `Category_name`, `Description`, `Is_active`, `Created_at`) VALUES
(1, 'Health Conditions', 'If you have any conditions please click here', 'true', '2026-03-04 17:06:29'),
(2, 'Food Allergies & Sensitivities', 'If you have any Allergies be aware ', 'true', '2026-03-04 17:09:47'),
(3, 'Dietary Restrictions & Preferences', '', 'true', '2026-03-04 17:27:50');

-- --------------------------------------------------------

--
-- Table structure for table `health_item`
--

CREATE TABLE `health_item` (
  `health_item_id` int(11) NOT NULL,
  `health_category_id` int(11) NOT NULL,
  `health_item_name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `is_active` int(1) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `health_item`
--

INSERT INTO `health_item` (`health_item_id`, `health_category_id`, `health_item_name`, `description`, `is_active`, `created_at`) VALUES
(7, 1, 'Diabetes (Type 1 or Type 2)', 'High blood sugar condition', 1, '2026-03-04 20:50:24'),
(8, 1, 'High Blood Pressure (Hypertension)', 'Elevated blood pressure', 1, '2026-03-04 20:50:24'),
(9, 1, 'Heart Disease / Cardiac Issues', 'Cardiovascular conditions', 1, '2026-03-04 20:50:24'),
(10, 1, 'High Cholesterol', 'Elevated cholesterol levels', 1, '2026-03-04 20:50:24'),
(11, 1, 'Thyroid Issues (Hypo/Hyperthyroidism)', 'Thyroid hormone imbalance', 1, '2026-03-04 20:50:24'),
(12, 1, 'Kidney Disease', 'Renal health conditions', 1, '2026-03-04 20:50:24'),
(13, 1, 'Obesity', 'Excess body weight condition', 1, '2026-03-04 20:50:24'),
(14, 1, 'Other Health Conditions', 'Other medical conditions', 1, '2026-03-04 20:50:24'),
(15, 2, 'High Sugar / Glucose Intolerance ', '', 1, '2026-03-04 17:17:46'),
(16, 2, 'Gluten (Celiac Disease)', '', 1, '2026-03-04 17:20:14'),
(17, 2, 'Preservatives / Additives ', '', 1, '2026-03-04 17:21:15'),
(18, 2, 'Dairy Products / Lactose ', '', 1, '2026-03-04 17:22:11'),
(19, 2, 'Nuts (Peanuts , Almonds, Etc..)', '', 1, '2026-03-04 17:22:11'),
(20, 2, 'Soy products ', '', 1, '2026-03-04 17:23:26'),
(21, 2, 'Eggs ', '', 1, '2026-03-04 17:23:26'),
(22, 2, 'MSG (Monosodium Glutamate)', '', 1, '2026-03-04 17:24:17'),
(23, 2, 'Artificial Colors / Flavors', '', 1, '2026-03-04 17:24:17'),
(24, 2, 'High Sodium / Salt Sensitivity', '', 1, '2026-03-04 17:25:15'),
(25, 3, 'Vegetarian', '', 1, '2026-03-04 17:28:14'),
(26, 3, 'Vegan', '', 1, '2026-03-04 17:28:44'),
(27, 3, 'Halal', '', 1, '2026-03-04 17:28:44'),
(28, 3, 'Low Sodium Diet', '', 1, '2026-03-04 17:29:07'),
(29, 3, 'Low Sugar Diet', '', 1, '2026-03-04 17:29:07'),
(30, 3, 'Kosher', '', 1, '2026-03-04 17:29:35');

-- --------------------------------------------------------

--
-- Table structure for table `Meals`
--

CREATE TABLE `Meals` (
  `Meal_id` int(11) NOT NULL,
  `Meal_name` varchar(100) NOT NULL,
  `Meal_type` enum('breakfast','lunch','dinner') NOT NULL,
  `Description` text NOT NULL,
  `Is_active` text NOT NULL,
  `Created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Meals`
--

INSERT INTO `Meals` (`Meal_id`, `Meal_name`, `Meal_type`, `Description`, `Is_active`, `Created_at`) VALUES
(4, 'Oatmeal with Berries', 'breakfast', 'Steel-cut oats, fresh blueberries, cinnamo', '1', '2026-03-04 13:33:52'),
(5, 'Boiled Eggs', 'breakfast', 'High protein, low carb', '1', '2026-03-04 13:34:26'),
(6, 'Green Tea', 'breakfast', 'Antioxidant-rich, no sugar', '1', '2026-03-04 13:34:39'),
(7, 'Mixed Nuts', 'lunch', '0g almonds, walnuts - rich in omega-3', '1', '2026-03-04 13:35:22'),
(8, 'Cucumber Slices', 'lunch', 'With lemon and chat masala', '1', '2026-03-04 13:36:19'),
(9, 'Brown Rice', 'lunch', '1 cup - high fiber, low GI', '1', '2026-03-04 13:36:48'),
(10, 'Dal (Lentils)', 'lunch', 'Rich in protein and fiber', '1', '2026-03-04 13:37:10'),
(11, 'Mixed Vegetable Curry', 'breakfast', 'Broccoli, carrots, beans', '0', '2026-03-04 13:37:30'),
(12, 'Cucumber Raita', 'lunch', 'Low-fat yogurt, cooling', '1', '2026-03-04 13:38:09'),
(13, 'Whole Wheat Chapati', 'breakfast', '2 pieces - complex carbs', '1', '2026-03-04 13:38:27'),
(14, 'Paneer Curry', 'breakfast', 'Low-fat cottage cheese', '1', '2026-03-04 13:38:39'),
(15, 'Mixed Vegetables', 'breakfast', 'Cauliflower, peas, tomatoes', '1', '2026-03-04 13:38:52'),
(16, 'Green Salad', 'breakfast', 'Lettuce, cucumber, tomato', '1', '2026-03-04 13:39:05');

-- --------------------------------------------------------

--
-- Table structure for table `meals_nutrition`
--

CREATE TABLE `meals_nutrition` (
  `nutrition_id` int(11) NOT NULL,
  `meal_id` int(11) NOT NULL,
  `calories` int(11) NOT NULL,
  `protein` int(11) NOT NULL,
  `carbs` int(11) NOT NULL,
  `fats` int(11) NOT NULL,
  `sodium` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meals_nutrition`
--

INSERT INTO `meals_nutrition` (`nutrition_id`, `meal_id`, `calories`, `protein`, `carbs`, `fats`, `sodium`) VALUES
(1, 4, 250, 8, 45, 5, 5),
(2, 5, 140, 12, 1, 10, 140),
(3, 6, 0, 0, 0, 0, 0),
(4, 7, 170, 6, 6, 15, 1),
(5, 8, 16, 1, 4, 0, 2),
(6, 9, 216, 5, 45, 2, 10),
(7, 10, 230, 18, 40, 1, 200),
(9, 11, 180, 5, 20, 8, 300),
(10, 12, 90, 4, 6, 5, 150),
(11, 13, 200, 6, 40, 2, 300),
(12, 14, 300, 14, 10, 24, 400),
(13, 15, 120, 4, 18, 3, 100),
(14, 16, 50, 2, 10, 0, 30);

-- --------------------------------------------------------

--
-- Table structure for table `meal_health_rule`
--

CREATE TABLE `meal_health_rule` (
  `meal_rule_id` int(11) NOT NULL,
  `meal_id` int(11) NOT NULL,
  `health_item_id` int(11) NOT NULL,
  `rule_type` enum('Allow','Block') NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meal_health_rule`
--

INSERT INTO `meal_health_rule` (`meal_rule_id`, `meal_id`, `health_item_id`, `rule_type`, `created_at`) VALUES
(1, 4, 7, 'Allow', '2026-03-04 19:19:05'),
(2, 4, 10, 'Allow', '2026-03-04 19:21:30'),
(3, 4, 29, 'Allow', '2026-03-04 19:21:30'),
(4, 5, 13, 'Allow', '2026-03-04 19:22:42'),
(5, 5, 21, 'Block', '2026-03-04 19:23:02'),
(6, 5, 29, 'Allow', '2026-03-04 19:23:28'),
(7, 6, 7, 'Allow', '2026-03-04 19:23:28'),
(8, 6, 8, 'Allow', '2026-03-04 19:23:44'),
(9, 6, 10, 'Allow', '2026-03-04 19:23:44'),
(10, 7, 19, 'Block', '2026-03-04 19:24:03'),
(11, 7, 10, 'Allow', '2026-03-04 19:24:03'),
(12, 8, 8, 'Allow', '2026-03-04 19:24:26'),
(13, 8, 24, 'Allow', '2026-03-04 19:24:26'),
(14, 8, 29, 'Allow', '2026-03-04 19:24:44'),
(15, 9, 7, 'Allow', '2026-03-04 19:24:44'),
(16, 9, 13, 'Allow', '2026-03-04 19:25:27'),
(17, 10, 13, 'Allow', '2026-03-04 19:25:27'),
(18, 10, 7, 'Allow', '2026-03-04 19:25:47'),
(19, 11, 7, 'Allow', '2026-03-04 19:25:47'),
(20, 11, 13, 'Allow', '2026-03-04 19:26:10'),
(21, 12, 18, 'Block', '2026-03-04 19:26:10'),
(22, 12, 8, 'Allow', '2026-03-04 19:26:30'),
(23, 13, 16, 'Block', '2026-03-04 19:26:30'),
(24, 13, 7, 'Allow', '2026-03-04 19:26:47'),
(25, 14, 18, 'Block', '2026-03-04 19:26:47'),
(26, 14, 10, 'Allow', '2026-03-04 19:27:06'),
(27, 15, 7, 'Allow', '2026-03-04 19:27:06'),
(28, 15, 13, 'Allow', '2026-03-04 19:27:28'),
(29, 16, 7, 'Allow', '2026-03-04 19:27:28'),
(30, 16, 8, 'Allow', '2026-03-04 19:27:42');

-- --------------------------------------------------------

--
-- Table structure for table `mstadmin`
--

CREATE TABLE `mstadmin` (
  `admin_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` text NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mstadmin`
--

INSERT INTO `mstadmin` (`admin_id`, `first_name`, `last_name`, `email`, `password`) VALUES
(1, 'Mayuri', 'Dave', 'mayuri@gmail.com', '1234'),
(2, 'Sneha ', 'Parikh', 'sneha@gmail.com', '123456');

-- --------------------------------------------------------

--
-- Table structure for table `mstuser`
--

CREATE TABLE `mstuser` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(40) NOT NULL,
  `last_name` varchar(40) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `is_active` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mstuser`
--

INSERT INTO `mstuser` (`user_id`, `first_name`, `last_name`, `email`, `password`, `contact`, `is_active`) VALUES
(1, 'Mayuri', 'Dave', 'm@gmail.com', '1234', '9427539889', 1),
(2, 'Shivani', 'Dave', 's@gmail.com', '12345', '9427539889', 1),
(3, 'Reshma', 'Dave', 'r@gmail.com', '1234', '1234567890', 1),
(4, 'Janvi', 'Parikh', 'j@gmail.com', '123', '1234567899', 1),
(5, 'Pranav', 'Dave', 'p@gmail.com', '1234', NULL, 1),
(6, 'Sneha', 'Parikh', 'si@gmail.com', '12345', NULL, 1),
(7, 'Vaishali ', 'Pandya', 'v@gmail.com', '1234', NULL, 1),
(8, 'champa', 'jaja', 'ja@gmail.com', '12345', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `nutrition_facts`
--

CREATE TABLE `nutrition_facts` (
  `nutrition_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `calories` float NOT NULL,
  `protein` float NOT NULL,
  `carbs` float NOT NULL,
  `fat` float NOT NULL,
  `fiber` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nutrition_facts`
--

INSERT INTO `nutrition_facts` (`nutrition_id`, `product_id`, `calories`, `protein`, `carbs`, `fat`, `fiber`) VALUES
(2, 2, 2.2, 2.3, 2.4, 2.5, 3.2),
(3, 1, 2.2, 2.3, 2.4, 2.5, 3.2),
(4, 5, 536, 7, 53, 34, 4),
(5, 6, 480, 5, 70, 20, 2),
(6, 7, 450, 9, 65, 18, 3),
(7, 8, 60, 3, 5, 3, 0),
(8, 9, 717, 1, 0, 81, 0),
(9, 10, 518, 7, 64, 26, 3),
(10, 11, 400, 7, 80, 2, 2),
(11, 12, 112, 1, 26, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `product_name` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`product_id`, `category_id`, `brand_id`, `product_name`, `description`, `image_url`, `created_at`) VALUES
(5, 6, 5, 'Lays Classic Salted', 'Good Chips for you 😋', '1772630299767.jpg', '2026-03-04 13:18:19'),
(6, 6, 6, 'Oreo Biscuits', 'Good when you want to eat sweet.', '1772630441291.avif', '2026-03-04 13:20:41'),
(7, 8, 4, 'Maggie', 'Good for instant food ', '1772630468589.webp', '2026-03-04 13:21:08'),
(8, 9, 9, 'Milk', 'Good for Immunity', '1772630710908.jpeg', '2026-03-04 13:25:10'),
(9, 9, 9, 'Butter', 'Tasty with anything.', '1772630774517.jpeg', '2026-03-04 13:26:14'),
(10, 9, 8, 'KitKat', 'Good when craving sweets', '1772630954675.jpeg', '2026-03-04 13:29:14'),
(11, 15, 6, 'Bournvitta', 'Good to drink with a milk.', '1772631076676.jpeg', '2026-03-04 13:31:16'),
(12, 8, 8, 'Tomato Ketchup ', 'Good to eat with anything.', '1772631152292.jpeg', '2026-03-04 13:32:32');

-- --------------------------------------------------------

--
-- Table structure for table `product_rating`
--

CREATE TABLE `product_rating` (
  `rating_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `review` text NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_rating`
--

INSERT INTO `product_rating` (`rating_id`, `user_id`, `product_id`, `rating`, `review`, `created_at`) VALUES
(3, 2, 2, 5, 'Very healthy and tasty product', '2026-02-12 14:23:05'),
(4, 1, 6, 2, '', '2026-03-04 22:25:00'),
(5, 1, 11, 4, '', '2026-03-04 22:25:10'),
(6, 5, 5, 5, '', '2026-03-04 23:17:44'),
(7, 5, 5, 2, '', '2026-03-05 00:25:21'),
(8, 5, 7, 5, 'ghgh', '2026-03-05 09:46:44'),
(9, 7, 8, 3, '', '2026-03-05 12:00:22');

-- --------------------------------------------------------

--
-- Table structure for table `User_daily_logs`
--

CREATE TABLE `User_daily_logs` (
  `daily_log_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `log_date` date DEFAULT NULL,
  `weight` int(11) NOT NULL,
  `bmi` int(11) NOT NULL,
  `water_glasses` int(11) NOT NULL,
  `calories_consumed` int(11) NOT NULL,
  `protein_consumed` int(11) NOT NULL,
  `exercise_minutes` int(11) NOT NULL,
  `notes` text NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `User_daily_logs`
--

INSERT INTO `User_daily_logs` (`daily_log_id`, `user_id`, `log_date`, `weight`, `bmi`, `water_glasses`, `calories_consumed`, `protein_consumed`, `exercise_minutes`, `notes`, `created_at`) VALUES
(1, 2, '2026-02-11', 60, 22, 8, 1800, 75, 45, 'Felt energetic today', '2026-02-11 17:43:27'),
(3, 1, '2026-02-13', 63, 23, 9, 1900, 80, 50, 'Updated daily log', '2026-02-11 17:43:45'),
(4, 4, '2026-02-12', 60, 22, 8, 1800, 75, 45, 'Felt energetic today', '2026-02-11 21:34:06'),
(5, 3, '2026-03-04', 65, 22, 7, 120, 12, 20, '', '2026-03-04 21:16:27'),
(6, 7, '2026-03-05', 65, 22, 7, 120, 120, 45, '', '2026-03-05 11:59:54');

-- --------------------------------------------------------

--
-- Table structure for table `user_favourites`
--

CREATE TABLE `user_favourites` (
  `favourite_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_favourites`
--

INSERT INTO `user_favourites` (`favourite_id`, `user_id`, `product_id`, `created_at`) VALUES
(3, 1, 10, '2026-03-04 19:26:37'),
(4, 1, 6, '2026-03-04 19:26:49'),
(5, 3, 9, '2026-03-04 21:13:57'),
(6, 4, 10, '2026-03-04 21:28:21'),
(7, 7, 7, '2026-03-05 12:00:32'),
(8, 7, 11, '2026-03-05 12:00:33');

-- --------------------------------------------------------

--
-- Table structure for table `user_health_item`
--

CREATE TABLE `user_health_item` (
  `user_health_item_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `health_item_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_health_item`
--

INSERT INTO `user_health_item` (`user_health_item_id`, `user_id`, `health_item_id`, `created_at`) VALUES
(3, 3, 14, '2026-03-04 21:15:27'),
(4, 3, 11, '2026-03-04 21:15:28'),
(5, 4, 7, '2026-03-04 21:28:53'),
(6, 4, 9, '2026-03-04 21:28:53'),
(12, 4, 27, '2026-03-04 22:00:23'),
(13, 4, 15, '2026-03-04 22:00:24'),
(14, 5, 7, '2026-03-04 22:55:40'),
(15, 5, 21, '2026-03-04 22:55:45'),
(16, 5, 23, '2026-03-04 22:55:46'),
(17, 5, 25, '2026-03-04 22:55:47'),
(18, 7, 7, '2026-03-05 11:58:56'),
(19, 7, 15, '2026-03-05 11:58:58'),
(20, 7, 21, '2026-03-05 11:58:58'),
(21, 7, 25, '2026-03-05 11:58:59');

-- --------------------------------------------------------

--
-- Table structure for table `user_health_profile`
--

CREATE TABLE `user_health_profile` (
  `profile_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date_of_birth` date NOT NULL,
  `gender` varchar(10) NOT NULL,
  `height_cm` float NOT NULL,
  `weight_kg` float NOT NULL,
  `bmi` float NOT NULL,
  `bmi_category_id` varchar(20) NOT NULL,
  `created_at` datetime NOT NULL,
  `age` int(11) DEFAULT NULL,
  `food_allergies` text DEFAULT NULL,
  `dietary_restrictions` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_health_profile`
--

INSERT INTO `user_health_profile` (`profile_id`, `user_id`, `date_of_birth`, `gender`, `height_cm`, `weight_kg`, `bmi`, `bmi_category_id`, `created_at`, `age`, `food_allergies`, `dietary_restrictions`) VALUES
(1, 1, '2000-05-15', 'Female', 165, 60, 22, '2', '2026-02-11 21:21:27', 20, 'Nuts', 'Vegan'),
(2, 3, '2000-05-01', 'Female', 165, 58, 21.3, '', '2026-02-11 21:29:49', 20, '[\"sugar\",\"gluten\"]', '[\"vegetarian\",\"vegan\"]'),
(3, 4, '2026-02-28', 'Female', 170, 60, 20.8, '', '2026-03-04 21:28:55', 20, 'Eggs', 'Vegetarian'),
(4, 2, '2025-03-05', 'female', 163, 56, 22, '1', '2026-03-04 17:41:35', 23, 'Soy products', 'Halal'),
(8, 5, '1964-08-25', 'Male', 165, 50, 18.4, '1', '2026-03-04 22:55:48', 58, NULL, NULL),
(9, 7, '2026-03-01', 'Female', 170, 65, 22.5, '1', '2026-03-05 11:59:00', 40, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_meal_log`
--

CREATE TABLE `user_meal_log` (
  `meal_log_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `meal_id` int(11) NOT NULL,
  `log_date` date NOT NULL,
  `meal_type` enum('breakfast','lunch','dinner') NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_meal_log`
--

INSERT INTO `user_meal_log` (`meal_log_id`, `user_id`, `meal_id`, `log_date`, `meal_type`, `quantity`, `created_at`) VALUES
(6, 1, 1, '2026-02-03', 'breakfast', 123, '2026-02-12 08:03:53'),
(7, 2, 3, '2026-02-11', 'breakfast', 2, '2026-02-11 09:30:00'),
(8, 1, 5, '2026-03-04', 'breakfast', 1, '2026-03-04 13:57:01'),
(9, 3, 5, '2026-03-04', 'breakfast', 1, '2026-03-04 15:46:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alternative`
--
ALTER TABLE `alternative`
  ADD PRIMARY KEY (`alternative_id`);

--
-- Indexes for table `bmicategory`
--
ALTER TABLE `bmicategory`
  ADD PRIMARY KEY (`Bmi_category_id`);

--
-- Indexes for table `brand`
--
ALTER TABLE `brand`
  ADD PRIMARY KEY (`Brand_id`),
  ADD UNIQUE KEY `Brand_name` (`Brand_name`);

--
-- Indexes for table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`Category_id`);

--
-- Indexes for table `Health_category`
--
ALTER TABLE `Health_category`
  ADD PRIMARY KEY (`Health_category_id`);

--
-- Indexes for table `health_item`
--
ALTER TABLE `health_item`
  ADD PRIMARY KEY (`health_item_id`);

--
-- Indexes for table `Meals`
--
ALTER TABLE `Meals`
  ADD PRIMARY KEY (`Meal_id`);

--
-- Indexes for table `meals_nutrition`
--
ALTER TABLE `meals_nutrition`
  ADD PRIMARY KEY (`nutrition_id`);

--
-- Indexes for table `meal_health_rule`
--
ALTER TABLE `meal_health_rule`
  ADD PRIMARY KEY (`meal_rule_id`);

--
-- Indexes for table `mstadmin`
--
ALTER TABLE `mstadmin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `mstuser`
--
ALTER TABLE `mstuser`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `nutrition_facts`
--
ALTER TABLE `nutrition_facts`
  ADD PRIMARY KEY (`nutrition_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `product_rating`
--
ALTER TABLE `product_rating`
  ADD PRIMARY KEY (`rating_id`);

--
-- Indexes for table `User_daily_logs`
--
ALTER TABLE `User_daily_logs`
  ADD PRIMARY KEY (`daily_log_id`),
  ADD UNIQUE KEY `log_date` (`log_date`);

--
-- Indexes for table `user_favourites`
--
ALTER TABLE `user_favourites`
  ADD PRIMARY KEY (`favourite_id`);

--
-- Indexes for table `user_health_item`
--
ALTER TABLE `user_health_item`
  ADD PRIMARY KEY (`user_health_item_id`);

--
-- Indexes for table `user_health_profile`
--
ALTER TABLE `user_health_profile`
  ADD PRIMARY KEY (`profile_id`);

--
-- Indexes for table `user_meal_log`
--
ALTER TABLE `user_meal_log`
  ADD PRIMARY KEY (`meal_log_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alternative`
--
ALTER TABLE `alternative`
  MODIFY `alternative_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `bmicategory`
--
ALTER TABLE `bmicategory`
  MODIFY `Bmi_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `brand`
--
ALTER TABLE `brand`
  MODIFY `Brand_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Category`
--
ALTER TABLE `Category`
  MODIFY `Category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `Health_category`
--
ALTER TABLE `Health_category`
  MODIFY `Health_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `health_item`
--
ALTER TABLE `health_item`
  MODIFY `health_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `Meals`
--
ALTER TABLE `Meals`
  MODIFY `Meal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `meals_nutrition`
--
ALTER TABLE `meals_nutrition`
  MODIFY `nutrition_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `meal_health_rule`
--
ALTER TABLE `meal_health_rule`
  MODIFY `meal_rule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `mstadmin`
--
ALTER TABLE `mstadmin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mstuser`
--
ALTER TABLE `mstuser`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `nutrition_facts`
--
ALTER TABLE `nutrition_facts`
  MODIFY `nutrition_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `product_rating`
--
ALTER TABLE `product_rating`
  MODIFY `rating_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `User_daily_logs`
--
ALTER TABLE `User_daily_logs`
  MODIFY `daily_log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_favourites`
--
ALTER TABLE `user_favourites`
  MODIFY `favourite_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `user_health_item`
--
ALTER TABLE `user_health_item`
  MODIFY `user_health_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `user_health_profile`
--
ALTER TABLE `user_health_profile`
  MODIFY `profile_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `user_meal_log`
--
ALTER TABLE `user_meal_log`
  MODIFY `meal_log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
