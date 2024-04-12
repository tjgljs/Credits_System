/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80036 (8.0.36)
 Source Host           : localhost:3306
 Source Schema         : credit

 Target Server Type    : MySQL
 Target Server Version : 80036 (8.0.36)
 File Encoding         : 65001

 Date: 12/04/2024 18:29:30
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user_basic
-- ----------------------------
DROP TABLE IF EXISTS `user_basic`;
CREATE TABLE `user_basic`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `identity` varchar(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '唯一标识',
  `name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '名称',
  `password` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '密码',
  `phone` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '手机号',
  `mail` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `private_key` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '0' COMMENT '私钥',
  `is_admin` tinyint(1) NULL DEFAULT 0 COMMENT '是否是管理员【0-否，1-是】',
  `created_at` datetime NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT NULL,
  `deleted_at` datetime NULL DEFAULT NULL,
  `public_key` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '公钥',
  `is_teacher` tinyint(1) NULL DEFAULT NULL,
  `is_top` tinyint(1) NULL DEFAULT NULL,
  `is_mechanism` tinyint(1) NULL DEFAULT NULL,
  `is_student` tinyint(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_basic
-- ----------------------------
INSERT INTO `user_basic` VALUES (5, '4aa5ea21-d75f-490e-8cb4-90cbaf49a2f5', '1', 'c4ca4238a0b923820dcc509a6f75849b', '1', '1539994641@qq.com', 'ef60735638d43c02f73e8f536705b052f4015439d8b86cef42ccf2a9b617eef1', 0, '2024-04-01 13:57:55', '2024-04-01 13:57:55', NULL, '0x83F6fD2800F6562E189d518b9064631839344449', 0, 0, 1, 0);
INSERT INTO `user_basic` VALUES (8, '5bab87c9-f15a-46c0-87f0-b2adfbf709ce', '2', 'c81e728d9d4c2f636f067f89cc14862c', '2', '256568573@qq.com', '06c8a819db289156214c20886886ee5e12c73cb4fbecc99032e033a9bb423856', 0, '2024-04-08 14:40:11', '2024-04-08 14:40:11', NULL, '0xFe3B84363e7CDD81d79F8954a3a7b4eE4504736F', 0, 0, 0, 1);

SET FOREIGN_KEY_CHECKS = 1;
