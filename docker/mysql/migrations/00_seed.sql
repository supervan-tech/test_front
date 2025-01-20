CREATE TABLE deliveries
(
    order_id                   INT AUTO_INCREMENT PRIMARY KEY,
    start_lat                  DECIMAL(10, 7) NOT NULL,
    start_lng                  DECIMAL(10, 7) NOT NULL,
    start_address              VARCHAR(255)   NOT NULL,
    end_lat                    DECIMAL(10, 7) NOT NULL,
    end_lng                    DECIMAL(10, 7) NOT NULL,
    end_address                VARCHAR(255)   NOT NULL,
    total_weight               DECIMAL(10, 2) NOT NULL,
    pickup_date_time           DATETIME       NOT NULL,
    delivery_date_time         DATETIME       NOT NULL,
    buyer_firstname            VARCHAR(100)   NOT NULL,
    buyer_lastname             VARCHAR(100)   NOT NULL,
    buyer_phone                VARCHAR(20)    NOT NULL,
    buyer_email                VARCHAR(255)   NOT NULL,
    pickup_contact_firstname   VARCHAR(100)   NOT NULL,
    pickup_contact_lastname    VARCHAR(100)   NOT NULL,
    pickup_contact_phone       VARCHAR(20)    NOT NULL,
    pickup_contact_email       VARCHAR(255)   NOT NULL,
    delivery_contact_firstname VARCHAR(100)   NOT NULL,
    delivery_contact_lastname  VARCHAR(100)   NOT NULL,
    delivery_contact_phone     VARCHAR(20)    NOT NULL,
    delivery_contact_email     VARCHAR(255)   NOT NULL,
    price                      DECIMAL(10, 2) NOT NULL,
    creation_date_time         DATETIME DEFAULT CURRENT_TIMESTAMP,
    status                     VARCHAR(50)    NOT NULL
);

CREATE TABLE steps
(
    step_id                    INT AUTO_INCREMENT PRIMARY KEY,
    step_code                  VARCHAR(100)   NOT NULL,
    order_id                   INT REFERENCES deliveries (order_id),
    start                      DATETIME NOT NULL,
    end                        DATETIME NOT NULL,
    creation_date_time         DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE regularisations
(
    regul_id                   INT AUTO_INCREMENT PRIMARY KEY,
    order_id                   INT REFERENCES deliveries (order_id),
    price_delta                DECIMAL(10, 2) NOT NULL,
    creation_date_time         DATETIME DEFAULT CURRENT_TIMESTAMP
);