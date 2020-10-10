-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: localhost    Database: ecoldb
-- ------------------------------------------------------
-- Server version	8.0.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ecol_charact`
--

DROP TABLE IF EXISTS `ecol_charact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ecol_charact` (
  `idecol` int(11) NOT NULL AUTO_INCREMENT,
  `ecol_name` varchar(45) DEFAULT NULL,
  `ecol_criteria` float DEFAULT NULL,
  `ecol_measure` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idecol`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ecol_charact`
--

LOCK TABLES `ecol_charact` WRITE;
/*!40000 ALTER TABLE `ecol_charact` DISABLE KEYS */;
INSERT INTO `ecol_charact` VALUES (13,'Energy',0.35,'m^3/kg'),(14,'CO2',0.15,'l/kg'),(15,'Water',0.1,'MJ/kg'),(16,'OilConsumption',0.2,'l/kg'),(17,'Garbage',0.05,'kg'),(18,'WaterConsumption',0.15,'l/kg');
/*!40000 ALTER TABLE `ecol_charact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ecolchar_value`
--

DROP TABLE IF EXISTS `ecolchar_value`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ecolchar_value` (
  `idecolchar_value` int(11) NOT NULL AUTO_INCREMENT,
  `ecol_value` float DEFAULT NULL,
  `fk_ecol_charact` int(11) DEFAULT NULL,
  `fk_materials` int(11) DEFAULT NULL,
  PRIMARY KEY (`idecolchar_value`),
  KEY `ecol_charact_idx` (`fk_ecol_charact`),
  KEY `materials_idx` (`fk_materials`),
  CONSTRAINT `ecol_charact` FOREIGN KEY (`fk_ecol_charact`) REFERENCES `ecol_charact` (`idecol`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `materials` FOREIGN KEY (`fk_materials`) REFERENCES `materials` (`idmaterials`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ecolchar_value`
--

LOCK TABLES `ecolchar_value` WRITE;
/*!40000 ALTER TABLE `ecolchar_value` DISABLE KEYS */;
INSERT INTO `ecolchar_value` VALUES (21,68.63,13,1),(22,559879,14,1),(23,10572.1,15,1),(24,500,16,1),(25,99.19,13,2),(26,598956,14,2),(27,325.08,15,2),(28,1100,16,2),(29,43.15,13,3),(30,707188,14,3),(31,9372.05,15,3),(32,0,16,3),(49,73,17,1),(50,10,18,1),(51,57,17,2),(52,7,18,2),(53,42.6,17,3),(54,1.13,18,3),(59,448510,14,9),(60,1035.2,15,9),(61,86.45,13,9),(62,1000,16,9),(63,45,17,9),(64,9.2,18,9),(65,933756,14,10),(66,1497.76,15,10),(67,91.98,13,10),(68,740,16,10),(69,133.8,17,10),(70,5.6,18,10),(71,1510540,14,11),(72,1702.67,15,11),(73,99.87,13,11),(74,1100,16,11),(75,166.8,17,11),(76,4,18,11),(77,953690,14,12),(78,1702.95,15,12),(79,109.11,13,12),(80,760,16,12),(81,98,17,12),(82,4.9,18,12),(83,238855,14,13),(84,13959.8,15,13),(85,12.73,13,13),(86,0,16,13),(87,26.2,17,13),(88,0.988,18,13),(89,306973,14,14),(90,4237.1,15,14),(91,60,13,14),(92,13,16,14),(93,39.5,17,14),(94,68.3,18,14),(95,280764,14,15),(96,2445.4,15,15),(97,58.49,13,15),(98,5.25,16,15),(99,72.4074,17,15),(100,105,18,15),(101,181142,14,16),(102,1158.32,15,16),(103,24.697,13,16),(104,0.0206,16,16),(105,943.8,17,16),(106,7.15,18,16);
/*!40000 ALTER TABLE `ecolchar_value` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_weight`
--

DROP TABLE IF EXISTS `material_weight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_weight` (
  `id_weight` int(11) NOT NULL AUTO_INCREMENT,
  `material_weight` float DEFAULT NULL,
  `fk_materials` int(11) DEFAULT NULL,
  `fk_packaging` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_weight`),
  KEY `packaging_idx` (`fk_packaging`),
  KEY `materials_idx` (`fk_materials`),
  CONSTRAINT `material` FOREIGN KEY (`fk_materials`) REFERENCES `materials` (`idmaterials`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `packaging` FOREIGN KEY (`fk_packaging`) REFERENCES `packaging` (`idpack`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_weight`
--

LOCK TABLES `material_weight` WRITE;
/*!40000 ALTER TABLE `material_weight` DISABLE KEYS */;
INSERT INTO `material_weight` VALUES (14,0.841,1,28),(15,14,2,29),(16,0.23,3,29),(24,2.218,3,34),(25,1.2075,1,36),(26,0.603,3,36),(27,0.5989,3,37),(28,1.1984,2,37),(29,0.5125,3,38),(30,0.8301,1,38),(31,0.23,3,39),(32,0.841,1,39);
/*!40000 ALTER TABLE `material_weight` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `idmaterials` int(11) NOT NULL AUTO_INCREMENT,
  `material_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idmaterials`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
INSERT INTO `materials` VALUES (1,'PVC'),(2,'PP'),(3,'Aluminium'),(9,'PS'),(10,'LDPE'),(11,'HDPE'),(12,'PET'),(13,'Glass'),(14,'Paper'),(15,'Cardboard'),(16,'Tin');
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pack_combination`
--

DROP TABLE IF EXISTS `pack_combination`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pack_combination` (
  `idpack_combination` int(11) NOT NULL AUTO_INCREMENT,
  `id_pack` int(11) DEFAULT NULL,
  `fk_id_group` int(11) DEFAULT NULL,
  PRIMARY KEY (`idpack_combination`),
  KEY `fk_packaging_idx` (`id_pack`),
  KEY `fk_group_idx` (`fk_id_group`),
  CONSTRAINT `fk_group` FOREIGN KEY (`fk_id_group`) REFERENCES `pack_groups` (`idpack_groups`),
  CONSTRAINT `fk_packaging` FOREIGN KEY (`id_pack`) REFERENCES `packaging` (`idpack`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pack_combination`
--

LOCK TABLES `pack_combination` WRITE;
/*!40000 ALTER TABLE `pack_combination` DISABLE KEYS */;
INSERT INTO `pack_combination` VALUES (1,34,1),(2,36,1),(3,37,1),(4,37,2),(5,38,2),(6,39,2);
/*!40000 ALTER TABLE `pack_combination` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pack_groups`
--

DROP TABLE IF EXISTS `pack_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pack_groups` (
  `idpack_groups` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idpack_groups`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pack_groups`
--

LOCK TABLES `pack_groups` WRITE;
/*!40000 ALTER TABLE `pack_groups` DISABLE KEYS */;
INSERT INTO `pack_groups` VALUES (1,'Pharma1'),(2,'Pharma2');
/*!40000 ALTER TABLE `pack_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `packaging`
--

DROP TABLE IF EXISTS `packaging`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `packaging` (
  `idpack` int(11) NOT NULL AUTO_INCREMENT,
  `pack_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idpack`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `packaging`
--

LOCK TABLES `packaging` WRITE;
/*!40000 ALTER TABLE `packaging` DISABLE KEYS */;
INSERT INTO `packaging` VALUES (28,'blister1'),(29,'blister2'),(34,'Blister(Alu)'),(36,'Blister(PVC/Alu)'),(37,'Blister(PP/Alu)'),(38,'Blister2(PVC/Alu)'),(39,'Blister3(PVC/Alu)');
/*!40000 ALTER TABLE `packaging` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(45) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `is_admin` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2b$08$L35gT3QKufrnz6WwstnSrOfN73UJhPSU2yKNmh52r.EXbaDiwys4O',1),(2,'vasya','$2b$08$fqZh4A8yH60K5oSZ3pKdKehNLp7LT754rmX43TkP2ZWBIXEzNeume',0),(3,'petya','$2b$08$wnkyvuA3N4lKqWacANFO/ebNHyIENlBVwBUqTGQsgFyLgMI/s8/kO',0),(4,'test','$2b$08$5Txec8Vo3atgmwfxDtepFeNTl0cN2BnMKXIeTxan4Xkq6dpIGiZQC',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'ecoldb'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-22 22:46:24
