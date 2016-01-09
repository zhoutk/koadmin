/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 50627
 Source Host           : 192.168.3.8
 Source Database       : koadmin

 Target Server Type    : MySQL
 Target Server Version : 50627
 File Encoding         : utf-8

 Date: 01/09/2016 22:30:40 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `member`
-- ----------------------------
DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `member`
-- ----------------------------
BEGIN;
INSERT INTO `member` VALUES ('1', 'sf23凯'), ('2', 'asfwe蜈蚣');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
