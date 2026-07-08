-- Data Center Monitoring Database Schema
-- Based on day3 data structure

CREATE DATABASE IF NOT EXISTS datacenter_monitor DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;

USE datacenter_monitor;

-- Host detail table
CREATE TABLE IF NOT EXISTS host_detail (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hostid VARCHAR(32) NOT NULL UNIQUE COMMENT '主机ID',
    hostname VARCHAR(128) NOT NULL COMMENT '主机名',
    idc_name VARCHAR(64) NOT NULL COMMENT '机房名称',
    ip_address VARCHAR(45) COMMENT 'IP地址',
    os_type VARCHAR(32) COMMENT '操作系统类型',
    cpu_cores INT COMMENT 'CPU核心数',
    memory_total BIGINT COMMENT '总内存MB',
    disk_total BIGINT COMMENT '总磁盘GB',
    status ENUM('online', 'offline', 'warning') DEFAULT 'online' COMMENT '主机状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_hostid (hostid),
    INDEX idx_idc (idc_name)
) ENGINE=InnoDB COMMENT='主机详情表';

-- Metric module detail table
CREATE TABLE IF NOT EXISTS mod_detail (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mod_name VARCHAR(64) NOT NULL UNIQUE COMMENT '指标名称',
    category VARCHAR(32) NOT NULL COMMENT '指标分类',
    unit VARCHAR(16) COMMENT '单位',
    description VARCHAR(128) COMMENT '指标描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='指标模块详情表';

-- Performance metrics time series (pref_tsar)
CREATE TABLE IF NOT EXISTS pref_tsar (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ts BIGINT NOT NULL COMMENT '时间戳毫秒',
    hostid VARCHAR(32) NOT NULL COMMENT '主机ID',
    mod VARCHAR(64) NOT NULL COMMENT '指标名称',
    value_num DECIMAL(18,2) COMMENT '数值',
    event_time DATETIME GENERATED ALWAYS AS (FROM_UNIXTIME(ts/1000)) STORED COMMENT '事件时间',
    dt DATE GENERATED ALWAYS AS (DATE(FROM_UNIXTIME(ts/1000))) STORED COMMENT '日期',
    hour INT GENERATED ALWAYS AS (HOUR(FROM_UNIXTIME(ts/1000))) STORED COMMENT '小时',
    minute INT GENERATED ALWAYS AS (MINUTE(FROM_UNIXTIME(ts/1000))) STORED COMMENT '分钟',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ts (ts),
    INDEX idx_hostid (hostid),
    INDEX idx_mod (mod),
    INDEX idx_dt_hour (dt, hour),
    INDEX idx_host_mod (hostid, mod),
    FOREIGN KEY (hostid) REFERENCES host_detail(hostid)
) ENGINE=InnoDB COMMENT='性能指标时间序列表';

-- Disk metrics time series (disk_tsar)
CREATE TABLE IF NOT EXISTS disk_tsar (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ts BIGINT NOT NULL COMMENT '时间戳毫秒',
    hostid VARCHAR(32) NOT NULL COMMENT '主机ID',
    mod VARCHAR(64) NOT NULL COMMENT '指标名称',
    value_num DECIMAL(18,2) COMMENT '数值',
    event_time DATETIME GENERATED ALWAYS AS (FROM_UNIXTIME(ts/1000)) STORED COMMENT '事件时间',
    dt DATE GENERATED ALWAYS AS (DATE(FROM_UNIXTIME(ts/1000))) STORED COMMENT '日期',
    hour INT GENERATED ALWAYS AS (HOUR(FROM_UNIXTIME(ts/1000))) STORED COMMENT '小时',
    minute INT GENERATED ALWAYS AS (MINUTE(FROM_UNIXTIME(ts/1000))) STORED COMMENT '分钟',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ts (ts),
    INDEX idx_hostid (hostid),
    INDEX idx_mod (mod),
    INDEX idx_dt_hour (dt, hour),
    INDEX idx_host_mod (hostid, mod),
    FOREIGN KEY (hostid) REFERENCES host_detail(hostid)
) ENGINE=InnoDB COMMENT='磁盘指标时间序列表';

-- Alert table
CREATE TABLE IF NOT EXISTS alert_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hostid VARCHAR(32) NOT NULL COMMENT '主机ID',
    alert_type ENUM('cpu_high', 'mem_high', 'disk_full', 'net_error', 'service_down') NOT NULL COMMENT '告警类型',
    severity ENUM('info', 'warning', 'critical') DEFAULT 'warning' COMMENT '严重程度',
    message VARCHAR(256) NOT NULL COMMENT '告警消息',
    is_resolved BOOLEAN DEFAULT FALSE COMMENT '是否已解决',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL COMMENT '解决时间',
    INDEX idx_hostid (hostid),
    INDEX idx_created_at (created_at),
    INDEX idx_severity (severity)
) ENGINE=InnoDB COMMENT='告警日志表';
