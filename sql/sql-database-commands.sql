SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


CREATE OR REPLACE DATABASE osi CHARACTER SET = 'utf8' COLLATE = 'utf8_general_ci';

CREATE USER 'your_user' IDENTIFIED BY 'your_password';

GRANT USAGE ON *.* TO 'your_user'@'localhost' IDENTIFIED BY 'your_password';

GRANT SELECT ON `your_user`.* TO 'osi'@'localhost';
GRANT DELETE ON `your_user`.* TO 'osi'@'localhost';
GRANT UPDATE ON `your_user`.* TO 'osi'@'localhost';
GRANT INSERT ON `your_user`.* TO 'osi'@'localhost';
FLUSH PRIVILEGES;

SHOW GRANTS FOR 'your_user'@'localhost';




USE `osi`;


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
  `sunset` int(11) NOT NULL,
  `has_motu` tinyint(1) NOT NULL,
  `has_reef` tinyint(1) NOT NULL,
  `is_volcano` tinyint(1) NOT NULL,
  `is_atoll` tinyint(1) NOT NULL,
  `has_town` int(11) NOT NULL,
  `has_trees` tinyint(1) NOT NULL,
  `tree_amt` int(11) NOT NULL,
  `village_size` int(11) NOT NULL,
  `isl_persist` float NOT NULL,
  `isl_lac` float NOT NULL,
  `isl_scale` float NOT NULL,
  `submission_date` date NOT NULL,
  `filename` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `islands`
  ADD PRIMARY KEY (`id`);
  
ALTER TABLE `islands`
  ADD CONSTRAINT generator_values UNIQUE (seed, name, colour_background, deep_ocean, shallow_ocean, land_one, land_two, land_three, beach, rock_one, rock_two, lava_one, lava_two, sunset, has_motu, has_reef, is_volcano, is_atoll, has_town, has_trees, tree_amt, village_size, isl_persist, isl_lac, isl_scal);

ALTER TABLE `islands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;
