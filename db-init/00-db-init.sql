-- MySQL dump 10.13  Distrib 5.7.22, for Linux (x86_64)
--
-- Host: localhost    Database: businesses
-- ------------------------------------------------------
-- Server version	5.7.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `admin` BOOLEAN DEFAULT false,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
  (0,'Admin','admin@businesses.com','$2a$08$Y00/JO/uN9n0dHKuudRX2eKksWMIHXDLzHWKuz/K67alAYsZRRike',1),
  (1,'Nick Arzner','nick@block15.com','$2a$08$Y2IHnr/PU9tzG5HKrHGJH.zH3HAvlR5i5puD5GZ1sHA/mVrHKci72',0),
  (2,'Tori Lockwood','tori@robnetts.com','$2a$08$bAKRXPs6fUPhqjZy55TIeO1e.aXud4LD81awrYncaCKJoMsg/s0c.',0),
  (3,'Joel Rea','joel@lickspigot.com','$2a$08$WvRkJm.bz3zoRnmA.aQZBewLopoe00nA4qbzbnLyS4eRbm2MFNkMO',0),
  (4,'The Owners','owners@firstalt.coop','$2a$08$FBStm3plzBCnh/MPIUsJ0.f7kJkp6aH47haXHb3HY.Gfygan7e8He',0),
  (5,'Kim Marchesi','kim@localboyzhawaiiancafe.com','$2a$08$q8njvTTel9JDR.BQbb1cD.XL73CR.QCOXLnofdpd9orbv0dzWGir.',0),
  (6,'William McCanless','william@interzoneorganic1','$2a$08$U7IXbbolDIk0SRlmH/dnT.FBCvf.EMvorShGlM65XeQFr./P0rhqe',0),
  (7,'Paul Turner','paul@darksidecinema.com','$2a$08$Kb1f8JbT/9kl.wRuRsRoYO19ddMcc79zXvfUcwchJJ1qHxVMDJN1K',0),
  (8,'Allan Stuart','allan@allanscoffee.com','$2a$08$ALw6f6NIpdptAUhhezTjhezjjnMLcbBP/uRnqVCwYNSWBdno6y2I6',0),
  (9,'Winco Employees','employees@wincofoods.com','$2a$08$64je8REF7I4j4bQuJKIdXO09VkCXJqoaF18znHs/a3zuKi/olDR/S',0),
  (10,'Philip Wilson','philib@bookbin.com','$2a$08$Ev.K7sU3yWrCUECK2O2a5.eA8mbvVEImv/EyYka1yhRxQFKIbxrfS',0),
  (11,'Fred Meyer','fred@fredmeyer.com','$2a$08$ljdJ4mrSIEXsaiEMu29xUuEFAOj43gL5rcR7wCq8Rl2z/bqzf.xuC',0),
  (12,'Mike Easter','mike@cyclotopia.com','$2a$08$Apk5L0bDogb4G6ZtoKluPeZXCxye0qdNZCah9TJX9QvdRqZ5hwWAy',0),
  (13,'Casey Collett','casey@oregoncoffeeandtea.com','$2a$08$5SL3bkbe5S1WnE6rWciiX.9HAfXG/UGbZAQU7K0S4XTNGIHapPBy2',0),
  (14,'John Semadeni','john@corvalliscycleryinc.com','$2a$08$xIku71t6OFFN9Ztil1Kh2eQWk/0lC8C.UThx3PwAwYCSMxdzpPhTO',0),
  (15,'Alex Spaeth','alex@spaethlumber.com','$2a$08$H9dDFONytVUgh2ZcCQlHL.8uP6RricbtoCk2vsr/roTBtGkYLUivS',0),
  (16,'Tristan James','tristan@newmorningbakery.com','$2a$08$pJFEMJNiTa7azhokPUnXZusS6NMqT3eBJE45sX6Kli380PZoM2nje',0)
  ;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `businesses`
--

DROP TABLE IF EXISTS `businesses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `businesses` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` char(2) NOT NULL,
  `zip` char(5) NOT NULL,
  `phone` char(12) NOT NULL,
  `category` varchar(255) NOT NULL,
  `subcategory` varchar(255) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `ownerid` mediumint(9) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ownerid` (`ownerid`),
  CONSTRAINT `businesses_ibfk_1` FOREIGN KEY (`ownerid`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `businesses`
--

LOCK TABLES `businesses` WRITE;
/*!40000 ALTER TABLE `businesses` DISABLE KEYS */;
INSERT INTO `businesses` VALUES
  (1,'Block 15','300 SW Jefferson Ave.','Corvallis','OR','97333','541-758-2077','Restaurant','Brewpub','http://block15.com',NULL,1),
  (2,'Robnett\'s Hardware','400 SW 2nd St.','Corvallis','OR','97333','541-753-5531','Shopping','Hardware',NULL,NULL,2),
  (3,'Corvallis Brewing Supply','119 SW 4th St.','Corvallis','OR','97333','541-758-1674','Shopping','Brewing Supply','http://www.lickspigot.com',NULL,3),
  (4,'First Alternative Co-op North Store','2855 NW Grant Ave.','Corvallis','OR','97330','541-452-3115','Shopping','Groceries',NULL,NULL,4),
  (5,'Local Boyz','1425 NW Monroe Ave.','Corvallis','OR','97330','541-754-5338','Restaurant','Hawaiian',NULL,NULL,5),
  (6,'Interzone','1563 NW Monroe Ave.','Corvallis','OR','97330','541-754-5965','Restaurant','Coffee Shop',NULL,NULL,6),
  (7,'Darkside Cinema','215 SW 4th St.','Corvallis','OR','97333','541-752-4161','Entertainment','Movie Theater','http://darksidecinema.com',NULL,7),
  (8,'The Beanery Downtown','500 SW 2nd St.','Corvallis','OR','97333','541-753-7442','Restaurant','Coffee Shop',NULL,NULL,8),
  (9,'WinCo Foods','2335 NW Kings Blvd.','Corvallis','OR','97330','541-753-7002','Shopping','Groceries',NULL,NULL,9),
  (10,'The Book Bin','215 SW 4th St.','Corvallis','OR','97333','541-752-0040','Shopping','Book Store',NULL,NULL,10),
  (11,'Fred Meyer','777 NW Kings Blvd.','Corvallis','OR','97330','541-753-9116','Shopping','Groceries',NULL,NULL,11),
  (12,'Cyclotopia','435 SW 2nd St.','Corvallis','OR','97333','541-757-9694','Shopping','Bicycle Shop',NULL,NULL,12),
  (13,'Oregon Coffee & Tea','215 NW Monroe Ave.','Corvallis','OR','97333','541-752-2421','Shopping','Tea House','http://www.oregoncoffeeandtea.com',NULL,13),
  (14,'Corvallis Cyclery','344 SW 2nd St.','Corvallis','OR','97333','541-752-5952','Shopping','Bicycle Shop',NULL,NULL,14),
  (15,'Spaeth Lumber','1585 NW 9th St.','Corvallis','OR','97330','541-752-1930','Shopping','Hardware',NULL,NULL,15),
  (16,'New Morning Bakery','219 SW 2nd St.','Corvallis','OR','97333','541-754-0181','Restaurant','Bakery',NULL,NULL,16),
  (17,'First Alternative Co-op South Store','1007 SE 3rd St.','Corvallis','OR','97333','541-753-3115','Shopping','Groceries',NULL,NULL,4),
  (18,'Block 15 Brewery & Tap Room','3415 SW Deschutes St.','Corvallis','OR','97333','541-752-2337','Restaurant','Brewpub','http://block15.com',NULL,1),
  (19,'The Beanery Monroe','2541 NW Monroe Ave.','Corvallis','OR','97330','541-757-0828','Restaurant','Coffee Shop',NULL,NULL,8);
/*!40000 ALTER TABLE `businesses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photos`
--

DROP TABLE IF EXISTS `photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `caption` text,
  `userid` mediumint(9) NOT NULL,
  `businessid` mediumint(9) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_userid` (`userid`),
  KEY `idx_businessid` (`businessid`),
  CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `photos_ibfk_2` FOREIGN KEY (`businessid`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photos`
--

LOCK TABLES `photos` WRITE;
/*!40000 ALTER TABLE `photos` DISABLE KEYS */;
INSERT INTO `photos` VALUES
  (1,NULL,11,15),
  (2,NULL,7,2),
  (3,'Hops',2,3),
  (4,'Sticky Hands',14,18),
  (5,NULL,5,2),
  (6,'Popcorn!',11,7),
  (7,'This is my dinner.',8,5),
  (8,'Big fermentor',5,18),
  (9,'Cake!',6,16),
  (10,NULL,2,5);
/*!40000 ALTER TABLE `photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `dollars` tinyint(4) NOT NULL,
  `stars` float NOT NULL,
  `review` text,
  `userid` mediumint(9) NOT NULL,
  `businessid` mediumint(9) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_userid` (`userid`),
  KEY `idx_businessid` (`businessid`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`businessid`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES
  (1,1,4.5,'Cheap, delicious food.',8,5),
  (2,2,4,NULL,11,15),
  (3,2,5,'Try the hazlenut torte.  It\'s the best!',6,16),
  (4,1,5,'Joel, the owner, is super friendly and helpful.',2,3),
  (5,1,5,'A Corvallis gem.',11,7),
  (6,1,5,'Yummmmmmm!',2,5),
  (7,2,4,NULL,7,2),
  (8,1,4,'How many fasteners can one room hold?',5,2),
  (9,1,4,'Good beer, good food, though limited selection.',14,18),
  (10,2,4.5,NULL,5,18);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-16  6:47:05
