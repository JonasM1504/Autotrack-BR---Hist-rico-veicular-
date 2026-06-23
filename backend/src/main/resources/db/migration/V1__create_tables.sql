CREATE TABLE vehicles (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    plate      VARCHAR(8)  NOT NULL UNIQUE,
    vin        VARCHAR(17) UNIQUE,
    brand      VARCHAR(60) NOT NULL,
    model      VARCHAR(60) NOT NULL,
    year       INT         NOT NULL,
    color      VARCHAR(40),
    fuel_type  VARCHAR(20),
    mileage    INT,
    status     VARCHAR(20) DEFAULT 'REGULAR',
    created_at DATETIME    DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE vehicle_history (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id   BIGINT NOT NULL,
    event_type   VARCHAR(20) NOT NULL,
    event_date   DATE        NOT NULL,
    description  TEXT,
    source       VARCHAR(100),
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE insurance (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id    BIGINT       NOT NULL,
    company       VARCHAR(100) NOT NULL,
    policy_number VARCHAR(50)  UNIQUE,
    coverage_type VARCHAR(50),
    start_date    DATE NOT NULL,
    end_date      DATE NOT NULL,
    status        VARCHAR(20) DEFAULT 'ACTIVE',
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE users (
    id         BIGINT       AUTO_INCREMENT PRIMARY KEY,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(20)  DEFAULT 'USER',
    created_at DATETIME     DEFAULT CURRENT_TIMESTAMP
);