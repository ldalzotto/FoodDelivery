BEGIN TRANSACTION;
drop table if exists static_images;

create table if not exists static_images
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data BLOB NOT NULL
);

/* Default template image */
INSERT INTO static_images VALUES(1,X'89504e470d0a1a0a0000000d49484452000001770000017708060000005ec00bfe000000017352474200aece1ce90000000467414d410000b18f0bfc6105000000097048597300000ec400000ec401952b0e1b00000ee949444154785eedddff5714e7bdc0f107c1af89dfa241319e90546313eb31b649eaffff436f6f6f12935abf35b5f50b229a1815ab1205e1eee7394caef75ec1057661f733afd7395b860596d861def3ecb333b323f71fce2e150052d9b6fc118044c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc011212778084c41d202171074868e4fec3d9a5e5655a6e646464798961b7b464b36e3b716fb96ddbb6956da3a3656971b1cccdcd9557af5e4519a2f4cbdfc1d0580efad8d858d9bd674f5d5eecacd7b8d13ee2de5235ea9ddbbd9999f2e38f3f96a74f9fd6cf49a013f918b9efddb7afbc3f3e5e8e1e3d5a77da22df2ee2de42db77ec283f7582fecfebd7ebe711f59892312d9347c43d6e11f558bf9f9c3a55de7befbd323f3fbffc1d6427ee2db3a313f6bf5fbb561e3c7850b66fdf2ee82d10917ff9f2653976ec58f9cd89137599fc3c0f6f9108fbd5ab57cbcf3fff5c9785bd1d623defdcb9b34ec15dffc73fea4e9dfcc4bd25464747cb9d3b77cac34ed86ddced14d371f7efddab53725e5fc9cf1a6e89987bbd79e386b0b75c043e46ef9de1fcf23d6425ee2d10a3f6dbb76ed543e44cc5b45bacff91cea87d7a6aaafe5d909717545b2046ebfff9e73fd78d79b5b837475830dc6ac0dfb29ec357e7cf97792faea625eec9c546fefcf9f372f9d2a555a7649ac3e60e1c38d0f9a1e53b193a4b8b4be5f1e3c76f7d961647cc9cfbfdefeb0beb76e839897b72f1c2d94f3ffd54e7db63837f9366e3fec3175fd4b3553b77d4cf193e11f43896fdc2b7dffe7afec29b2c2c2c94939f7c520e1e3ce8e4a6a4c43db9d8c0ef4e4fd7dbe80a718f11fbf1e3c7cbc4b1637599e1163bf1788de5debd7b2bceab47dc273ffaa88c8f8f8b7b525e504d2e466e7564beca53f4f87a44c0d3f31c1697d7e75b59dfa9893b95b0432ee20e9090b8032424ee0009893b7d112fe4c6999071b4ce6a87e401fd21eef44c043c0ec38b93a57ef9e59732fbe851bdb4705c85f2e9bf9f76be63a97ecd69efd07f8e734f2e427a676aaaccccccac7eccf3e464193f72645dc73c47d423da11f138b67af6f1e35fef6fc4d138f1d8bb76ed2a87df7fbf5e5b3c7604f1bbe9ad38116d667aba4cc7b90d7d5ae70c3e23773624023df7fc79f9e6ebafcbdfaf5eed8cd0fffdebe83d3e36b7f83cae291e2189eb8affd75ffe526efceb5ff56ba66ca0f7c49d758beb92dcba79b35cbc78b1463b2e27fbb6f9f5f85a8c26e367e3bd5b63a710a3c8f839a0776c51ac4bc4f9ca952b75ba673defea14df1fa3f698aeb9f0cd37758e5ee0a1776c4dac594cb15cffe187f2f8d1a3babc916995087a8cf8fffafdf7f5ba361b792ce07f883b6b12318eb7eabb77ff7e0d7b2f34a3f8bf5dbc58b6773e021b27eeac49c4fd87cea83da6627a291e37ae311e4778d4cb0e031b22ee742d027cf7eeddbadc8fe99318bddfbe7dbbfe1e60636c45742de23bd3897bbf4e428a1d46bcc0fac0bbf3c386d982e84a84f7d9b36775eaa49f2f7ac68e234e861277d8185b105d89a03f999ded7b74ebef79f2a4af3b905e89ffc6b8d9113188fc55d29588d8dcdc5cdfa31b8f1fef013ae86ff717417ff1e245f98f3ffda9ee8cfa355505eb25ee746d6193825b033fc0d79c89b0c74957716cfeeeddbbcb95cb97059e8123eeb006af87bd39812b0e0bbd7ce992c03350c49dae8d6d52b8e28899413c99e94d610f02cf201277ba12c1ddbd674ffdd84f35ec9d700e5a20570a7b43e01934e24e5722bafbf6edebfbb5bf9bdfd3ef9dc85abc2dec0d816790883b5d89d8bef3ce3b355efd0c6f1c2573e8d0a1817903896ec3de10780685b8d3b5b8ee7abc8352bf0e538c9d46c4f1f0f8f840c47dad616f083c8340dce95a0477a213f7d08fd17bec3c3efcf0c3a10e7b43e0d96ae2ce9a44784f9d3a552f43d04bf1b83b3b31fce0f8f1b2b8c527306d34ec0d81672b893b6b12117eefd0a172f4c8917a26692fc4b38018b59f397bb6678fb95ebd0a7b43e0d92ae2ce9a45804f7646ef070e1eaccb1b99a2899d453cc6e7e7ced5f0f5f3c5dab7e975d81b02cf561077d625a6654e9f3e5d262626eaf25ae7c99bd17a84ef0f5f7c5176eddab5e6c7e8a57e85bd21f06c367167dd22ea931f7d54ce7e7eb68c8e8d95f9e5c8af36fa8eafc5d136f1b3e3478e942fbffaaa5e273e73d81b02cf661277362446dfbb77ef295f7ef965f9ed679f9577f7eeadf745e817e6e7eb72fdbcb31c57518c901eed8cf6ff78fe7cf9f8e38febd7324ec5ac44e0d92c23f71fce6edd9645df453cee4c4d95999999154312819d9c9cac23e98d8ca0235cf577743e3e7ffab44633ae245983d609e73befbe5b031abf63102ee9bbd9617f5decd0e2d9cbefce9ca967e4f6f2ff8f780fda99e9e9fa7eb4fd5ee70c2e23777aa699478f11fbce5dbbcafe0307cae1c387eb19a731a20f31826f7bd883113cfd26eef445843e6e312a8cdb564ebdfc5f5b1df686c0d34fe24eab0c4ad81b024fbf883bad3168616f083cfd20eeb4c2a086bd21f0f49ab893dea087bd21f0f492b893dab084bd21f0f48ab8b3e522c0fd306c616f083cbd20ee6ca988eeccddbb3d0ffcb086bdf17ae0676767059e351377b64cc4ebf6ad5be5e6cd9b35c2718d995e18f6b0379ac05fb97c59e0593371674b44b46e75a27ee7ce9d7a45c83873f5bb0b17361cf82c616f083ceb25ee6cbad7c31ecb21a2b5d1c0670b7b43e0590f716753bd29ec8d8d043e6bd81bbf06fed2a5f2f8f1e374ff3e7a4fdcd934ab85bdb19ec0670f7b23fe5d639d7fdfa3478feabf1956e32f844dd14dd81b6b097c5bc2fe3a61a71bfe4ae8bbb584bdd14de0db1876e896b8d357eb097b63b5c00b3bac4edce99b8d84bdf1a6c00b3bbc9db8d317bd087be3f5c0c763fd323757fefadd77c20eab10777aae97616f3481ffbe335abf74e952d9de795c618795893b3dd58fb03722f02f5fbca8d332c20eab13777aa69f616f44d4851dde4edce989cd083bd03d7167c3841d068fb8b321c20e8349dc59376187c125eeac8bb0c3601377d64cd861f0893b6b22ec301cc49daec5e9fec20ec341dce94a9c151a519f9a9a12761802e24e57e2acd0a7cf9e95ed5dbe3b12b0b5c49dae6d73da3f0c0d71074848dc011212778084c41d202171074848dc011212778084c41d202171074848dc01121ab9ff707669799984464747cb9da9a93233335397df646161a14c4e4e96f12347cae2e2e2f2bdff5bfcecb56bd7cac3070fcab6151e87fe7bf5ea55393a31514e9c385197df24d6cfccf47499eedc36b2ce196ee29e5cafe21ee2e7857deb2d76a2be52d883b813c43db95ec69de120ee0473ee0009893b4042e20e9090b8032424eec9c5abe5ddbc7f52bc8d1e89589fad27eed92d2d9591d1d1ce87950f8a8ab03f9f9b5bf1c80a86cb58673d3e7ff6ecad3bec916d36ffcc1c0a99dcb6ce06fcf0e1c3f2cfebd7cbd80a6f6e1de18f43e34e9e3c590f8dabf7d5ff659844ca63bdddbb7bb7dcb871a3aeef95023f3f3f5f3efdecb3b277efde5577fc0c2f716f8108f777172e941d3b762cdff3ffc5061e27c638e679f8c50e3d9e85ad14f658d72f5fbe2ce7cf9fb7134f4cdc5b607b27eadf7efd750db7b975e2ef60e7ce9de5f373e7ea089e9c4cbab5c0abcec87de2830fea081ee219dab1cedfc36a973060f8897b0bc448edd8c444191d1b33bfda7275d4be6367797f7cdc145c72e2de12316affdde9d3e5c58b1702df52b1de631ae6f499d365c1744c7ae2de12b161efdeb3a77cfae9a7e5a5c0b74eacef7811f5f49933654767e46efde727ee2d1273ac870e1fae1b788ce0e2731b796eb17e633dc7eb2e67cf9e2dfbf7ed33d7de128e9669a138546eb1b3d1c7b1ef3f3f78500f9b8bfb1c499347443de6d423e4e3e3e3e537274ed4fbcdb3b787b8b7589ce41223f81fefdf2f4f9e3c2973737365e195236a86ddd8e8589d82dbbf7f7f0d7bac67474ab58fb85347ed46eeb934237723f5f612778084bca00a9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b4042e20e9090b8032424ee0009893b403aa5fc375358261c3ade7e690000000049454e44ae426082');

drop table if exists users;

create table if not exists users
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_validated INTEGER NOT NULL
);

drop table if exists user_validation;

create table if not exists user_validation
(
    ts INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    mail_token TEXT NOT NULL
);

drop table if exists country;

create table if not exists country
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);


create index country_name on country(name);

drop table if exists city;

create table if not exists city
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    numeric_id_0 INTEGER,
    country_id INTEGER NOT NULL
);

create index city_name on city(name);

drop table if exists establishment_address;

create table if not exists establishment_address
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    street_full_name TEXT NOT NULL,
    city_id INTEGER NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL
);

create index establishment_address_lat on establishment_address(lat);
create index establishment_address_long on establishment_address(lng);

drop table if exists establishments;

create table if not exists establishments
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address_id INTEGER NOT NULL,
    phone TEXT NOT NULL,
    thumb_id INTEGER,
    user_id INTEGER NOT NULL
);

drop table if exists dish;

create table if not exists dish
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    thumb_id INTEGER,
    user_id INTEGER NOT NULL
);

drop table if exists establishment_dish;

create table if not exists establishment_dish
(
    establishment_id INTEGER NOT NULL,
    dish_id INTEGER NOT NULL
);

drop table if exists sessions;

create table if not exists sessions
(
    token TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    emission_time INTEGER NOT NULL,
    expiration_time INTEGER NOT NULL,
    is_cancelled INTEGER NOT NULL
);

insert into country (id, name) values (1, 'France');

insert into city (id, name, numeric_id_0, country_id) values (1, 'Paris', 75000, 1);
insert into city (id, name, numeric_id_0, country_id) values (2, 'Marseille', 13000, 1);
insert into city (id, name, numeric_id_0, country_id) values (3, 'Lyon', 69000, 1);

COMMIT;