-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 09 oct. 2024 à 12:57
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `platinium_bank`
--

-- --------------------------------------------------------

--
-- Structure de la table `account`
--

CREATE TABLE `account` (
  `id` int(11) NOT NULL,
  `balance` float NOT NULL,
  `accountType` enum('courant','pro','livret_a','commun') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `account`
--

INSERT INTO `account` (`id`, `balance`, `accountType`) VALUES
(1, 0, 'pro'),
(2, 0, 'courant'),
(3, 0, 'livret_a'),
(4, 0, 'commun'),
(5, 0, 'courant'),
(6, 0, 'commun');

-- --------------------------------------------------------

--
-- Structure de la table `account_users`
--

CREATE TABLE `account_users` (
  `accountId` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `account_users`
--

INSERT INTO `account_users` (`accountId`, `userId`) VALUES
(5, 2),
(6, 1),
(6, 2);

-- --------------------------------------------------------

--
-- Structure de la table `card`
--

CREATE TABLE `card` (
  `id` int(11) NOT NULL,
  `cardNumber` varchar(255) NOT NULL,
  `pinCode` varchar(255) NOT NULL,
  `accountId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `withdrawalLimit` decimal(10,2) NOT NULL DEFAULT 500.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `card`
--

INSERT INTO `card` (`id`, `cardNumber`, `pinCode`, `accountId`, `userId`, `withdrawalLimit`) VALUES
(1, '5131388694474864', '$2b$10$wDOqFgaSlFOUMFns4iiK4.e6eTksL.cEQtk5wBBwdkDd1kBlng7su', 1, 2, 500.00),
(2, '5131912691080393', '$2b$10$Wey6cCXKZcbi53BH3O5XCuQkUmAaaNTwheJYNfgwyFI9yu.Q3v/ia', 2, 2, 500.00),
(3, '5131940316774083', '$2b$10$6WaXlkxIa9L57gzQKZDOgOe1oPqVMMY944hRpecsprVix9l6X2lE6', 4, 2, 500.00),
(4, '5131470529557741', '$2b$10$erivMuq0Ty7R2ne1niIKverKag6pH.flkecU7DQlW4F463MRGpCaK', 5, 2, 500.00);

-- --------------------------------------------------------

--
-- Structure de la table `dab`
--

CREATE TABLE `dab` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `dab`
--

INSERT INTO `dab` (`id`, `name`) VALUES
(1, 'coucou'),
(2, 'deux');

-- --------------------------------------------------------

--
-- Structure de la table `operation`
--

CREATE TABLE `operation` (
  `id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `amount` decimal(10,2) DEFAULT NULL,
  `isWithdrawal` tinyint(4) DEFAULT NULL,
  `cardId` int(11) NOT NULL,
  `dabId` int(11) NOT NULL,
  `transferId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `operation`
--

INSERT INTO `operation` (`id`, `date`, `amount`, `isWithdrawal`, `cardId`, `dabId`, `transferId`) VALUES
(2, '2024-10-09 10:00:00', 150.00, 1, 1, 1, NULL),
(3, '2024-10-09 10:00:00', 250.00, 1, 2, 2, NULL),
(4, '2024-10-09 10:00:00', 600.00, 0, 3, 1, NULL),
(5, '2024-10-09 10:00:00', 300.00, 1, 3, 1, NULL),
(6, '2024-10-09 10:00:00', 300.00, 1, 3, 1, NULL),
(7, '2024-10-09 10:00:00', 300.00, 1, 3, 1, NULL),
(8, '2024-10-09 10:00:00', 300.00, 1, 3, 1, NULL),
(9, '2024-10-09 10:00:00', 300.00, 1, 3, 1, NULL),
(10, '2024-10-09 10:00:00', 300.00, 1, 3, 1, NULL),
(11, '2024-10-09 10:00:00', 300.00, 1, 3, 1, NULL),
(12, '2024-10-09 10:00:00', 300.00, 1, 3, 1, NULL),
(13, '2024-10-09 09:00:00', 300.00, 1, 3, 1, NULL),
(14, '2024-10-09 09:00:00', 300.00, 1, 3, 1, NULL),
(15, '2024-10-09 09:00:00', 300.00, 1, 3, 1, NULL),
(16, '2024-10-09 11:00:00', 300.00, 1, 3, 1, NULL),
(17, '2024-10-09 11:00:00', 300.00, 1, 3, 1, NULL),
(18, '2024-10-09 11:00:00', 300.00, 1, 3, 1, NULL),
(19, '2024-10-09 11:00:00', 300.00, 1, 3, 1, NULL),
(20, '2024-10-09 11:00:00', 300.00, 1, 3, 1, NULL),
(21, '2024-10-09 11:00:00', 300.00, 1, 3, 1, NULL),
(22, '2024-10-09 11:00:00', 300.00, 1, 3, 1, NULL),
(23, '2024-10-09 11:00:00', 300.00, 1, 1, 1, NULL),
(24, '2024-10-09 11:00:00', 300.00, 1, 4, 1, NULL),
(25, '2024-10-09 11:00:00', 666.00, 0, 4, 1, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `transaction`
--

CREATE TABLE `transaction` (
  `id` int(11) NOT NULL,
  `transactionType` varchar(255) NOT NULL,
  `amount` float NOT NULL,
  `destinationAccountId` int(11) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `accountId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `transfer`
--

CREATE TABLE `transfer` (
  `id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `fromAccId` int(11) NOT NULL,
  `toAccId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`) VALUES
(1, '', '', ''),
(2, 'Michel', 'abc@gmail.com', 'abcdef123*');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `account_users`
--
ALTER TABLE `account_users`
  ADD PRIMARY KEY (`accountId`,`userId`),
  ADD KEY `IDX_401915d015966b749990901bc5` (`accountId`),
  ADD KEY `IDX_11d949b37b3bce739d846874ba` (`userId`);

--
-- Index pour la table `card`
--
ALTER TABLE `card`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_6929cab8da9e7669da4bec04905` (`accountId`),
  ADD KEY `FK_77d7cc9d95dccd574d71ba221b0` (`userId`);

--
-- Index pour la table `dab`
--
ALTER TABLE `dab`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `operation`
--
ALTER TABLE `operation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_11b72ed7f7b1d373afb26215b96` (`cardId`),
  ADD KEY `FK_40a3ebcf137ed144ae3b224f825` (`dabId`),
  ADD KEY `FK_4a4fd7f52b1cfd7dc32d370b384` (`transferId`);

--
-- Index pour la table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_3d6e89b14baa44a71870450d14d` (`accountId`);

--
-- Index pour la table `transfer`
--
ALTER TABLE `transfer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_a184c0c771b07c815500114cb0e` (`fromAccId`),
  ADD KEY `FK_62ec466e67a76b4e3c5b4b1d451` (`toAccId`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `account`
--
ALTER TABLE `account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `card`
--
ALTER TABLE `card`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `dab`
--
ALTER TABLE `dab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `operation`
--
ALTER TABLE `operation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT pour la table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `transfer`
--
ALTER TABLE `transfer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `account_users`
--
ALTER TABLE `account_users`
  ADD CONSTRAINT `FK_11d949b37b3bce739d846874bac` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_401915d015966b749990901bc53` FOREIGN KEY (`accountId`) REFERENCES `account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `card`
--
ALTER TABLE `card`
  ADD CONSTRAINT `FK_6929cab8da9e7669da4bec04905` FOREIGN KEY (`accountId`) REFERENCES `account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_77d7cc9d95dccd574d71ba221b0` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `operation`
--
ALTER TABLE `operation`
  ADD CONSTRAINT `FK_11b72ed7f7b1d373afb26215b96` FOREIGN KEY (`cardId`) REFERENCES `card` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_40a3ebcf137ed144ae3b224f825` FOREIGN KEY (`dabId`) REFERENCES `dab` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_4a4fd7f52b1cfd7dc32d370b384` FOREIGN KEY (`transferId`) REFERENCES `transfer` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `FK_3d6e89b14baa44a71870450d14d` FOREIGN KEY (`accountId`) REFERENCES `account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `transfer`
--
ALTER TABLE `transfer`
  ADD CONSTRAINT `FK_62ec466e67a76b4e3c5b4b1d451` FOREIGN KEY (`toAccId`) REFERENCES `account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_a184c0c771b07c815500114cb0e` FOREIGN KEY (`fromAccId`) REFERENCES `account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
