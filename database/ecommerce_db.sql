-- Base de datos del proyecto project-backend (SQL Server)
-- Coincide con las entidades: users, roles y la tabla intermedia user_has_roles

IF DB_ID('ecommerce_db') IS NULL
    CREATE DATABASE ecommerce_db;
GO

USE ecommerce_db;
GO

-- Tabla de roles (entidad Rol)
IF OBJECT_ID('dbo.roles', 'U') IS NULL
CREATE TABLE dbo.roles (
    id         NVARCHAR(255) NOT NULL,
    name       NVARCHAR(255) NOT NULL,
    image      NVARCHAR(255) NOT NULL,
    route      NVARCHAR(255) NOT NULL,
    created_at DATETIME      NOT NULL CONSTRAINT DF_roles_created_at DEFAULT GETDATE(),
    updated_at DATETIME      NOT NULL CONSTRAINT DF_roles_updated_at DEFAULT GETDATE(),
    CONSTRAINT PK_roles PRIMARY KEY (id),
    CONSTRAINT UQ_roles_name UNIQUE (name)
);
GO

-- Tabla de usuarios (entidad User)
IF OBJECT_ID('dbo.users', 'U') IS NULL
CREATE TABLE dbo.users (
    id                 INT IDENTITY(1,1) NOT NULL,
    name               NVARCHAR(255) NOT NULL,
    lastname           NVARCHAR(255) NOT NULL,
    email              NVARCHAR(255) NOT NULL,
    phone              NVARCHAR(255) NOT NULL,
    image              NVARCHAR(255) NULL,
    password           NVARCHAR(255) NOT NULL,
    notification_token NVARCHAR(255) NULL,
    created_at         DATETIME      NOT NULL CONSTRAINT DF_users_created_at DEFAULT GETDATE(),
    updated_at         DATETIME      NOT NULL CONSTRAINT DF_users_updated_at DEFAULT GETDATE(),
    CONSTRAINT PK_users PRIMARY KEY (id),
    CONSTRAINT UQ_users_email UNIQUE (email),
    CONSTRAINT UQ_users_phone UNIQUE (phone)
);
GO

-- Relación muchos a muchos entre usuarios y roles
IF OBJECT_ID('dbo.user_has_roles', 'U') IS NULL
CREATE TABLE dbo.user_has_roles (
    id_user INT           NOT NULL,
    id_rol  NVARCHAR(255) NOT NULL,
    CONSTRAINT PK_user_has_roles PRIMARY KEY (id_user, id_rol),
    CONSTRAINT FK_user_has_roles_user FOREIGN KEY (id_user)
        REFERENCES dbo.users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_user_has_roles_rol FOREIGN KEY (id_rol)
        REFERENCES dbo.roles (id) ON DELETE CASCADE ON UPDATE CASCADE
);
GO

CREATE INDEX IDX_user_has_roles_user ON dbo.user_has_roles (id_user);
CREATE INDEX IDX_user_has_roles_rol  ON dbo.user_has_roles (id_rol);
GO

-- Roles iniciales (el registro asigna 'CLIENT' por defecto)
MERGE dbo.roles AS destino
USING (VALUES
    ('ADMIN',    'ADMINISTRADOR', 'https://cdn-icons-png.flaticon.com/512/1424/1424453.png', '/admin/home'),
    ('CLIENT',   'CLIENTE',       'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', '/client/home'),
    ('DELIVERY', 'REPARTIDOR',    'https://cdn-icons-png.flaticon.com/512/2830/2830305.png', '/delivery/home')
) AS origen (id, name, image, route)
ON destino.id = origen.id
WHEN NOT MATCHED THEN
    INSERT (id, name, image, route) VALUES (origen.id, origen.name, origen.image, origen.route);
GO
