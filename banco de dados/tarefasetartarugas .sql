create database tarefasEtartarugas;
use tarefasEtartarugas;

CREATE TABLE `classe` (
  `nome` varchar(30) NOT NULL);

INSERT INTO `classe` (`nome`) VALUES
('cágado'),
('jabuti'),
('tartaruga');

CREATE TABLE `etiqueta` (
  `ID` int(11) NOT NULL,
  `Nome` varchar(60) DEFAULT NULL);

CREATE TABLE `etiqueta_missao` (
  `fk_Etiqueta_ID` int(11) DEFAULT NULL,
  `fk_Missao_ID` int(11) DEFAULT NULL);

CREATE TABLE `etiqueta_tarefa` (
  `fk_Etiqueta_ID` int(11) DEFAULT NULL,
  `fk_Tarefa_ID` int(11) DEFAULT NULL);

CREATE TABLE `guilda` (
  `ID` int(11) NOT NULL,
  `nome` varchar(70) DEFAULT NULL,
  `descricao` varchar(80) DEFAULT NULL);

CREATE TABLE `guilda_usuario` (
  `fk_Usuario_ID` int(11) DEFAULT NULL,
  `fk_Guilda_id` int(11) DEFAULT NULL);

CREATE TABLE `hash` (
  `hash` varchar(32) DEFAULT NULL,
  `usado` tinyint(1) DEFAULT NULL,
  `dataCriado` date DEFAULT NULL,
  `id` int(11) NOT NULL,
  `fk_email_usuario` varchar(32) DEFAULT NULL);

CREATE TABLE `item` (
  `Nome` varchar(40) NOT NULL,
  `Descricao` varchar(60) DEFAULT NULL,
  `Preco` float DEFAULT NULL,
  `Quantidade` int(11) DEFAULT NULL,
  `fk_Classe_nome` varchar(30) DEFAULT NULL,
  `Item_tipo` varchar(50) DEFAULT NULL);

CREATE TABLE `item_usuario` (
  `fk_Usuario_ID` int(11) DEFAULT NULL,
  `fk_Item_Nome` varchar(40) DEFAULT NULL);

CREATE TABLE `missao` (
  `ID` int(11) NOT NULL,
  `Nome` varchar(60) DEFAULT NULL,
  `Descricao` varchar(60) DEFAULT NULL,
  `Dificuldade` varchar(20) DEFAULT NULL,
  `DataCriacao` date DEFAULT NULL,
  `DataLimite` date DEFAULT NULL,
  `vida_boss` float DEFAULT 100,
  `completa` tinyint(1) DEFAULT NULL,
  `fk_Guilda_id` int(11) DEFAULT NULL,
  `Recompensa_moedas` float DEFAULT NULL,
  `Recompensa_xp` float DEFAULT NULL);

DELIMITER $$
CREATE TRIGGER `atualizar_recompensa_missao` AFTER UPDATE ON `missao` FOR EACH ROW BEGIN
    DECLARE mult_dific INT DEFAULT 1;
    DECLARE interval_days INT;
    DECLARE dias_mult DOUBLE;
    DECLARE mult_classem DOUBLE DEFAULT 1;
    DECLARE mult_classex DOUBLE DEFAULT 1;
    DECLARE classe VARCHAR(16);
    DECLARE usuario_id INT;
    SELECT fk_usuario_id INTO usuario_id
    FROM usuario_missao
    WHERE fk_missao_id = NEW.id LIMIT 1;  
    IF usuario_id IS NOT NULL THEN
        SELECT fk_classe_nome INTO classe
        FROM usuario
        WHERE id = usuario_id LIMIT 1; 
        IF classe = 'tartaruga' THEN
            SET mult_classex = 1.5;
            SET mult_classem = 1;
        ELSEIF classe = 'jabuti' THEN
            SET mult_classem = 1.5;
            SET mult_classex = 1;
        ELSE
            SET mult_classem = 1;
            SET mult_classex = 1;
        END IF;
        SET interval_days = DATEDIFF(NEW.DataLimite, OLD.DataCriacao);
        IF interval_days <= 3 THEN
            SET dias_mult = 2.5;
        ELSEIF interval_days <= 15 THEN
            SET dias_mult = 1.5;
        ELSE
            SET dias_mult = 1;
        END IF;
        IF NEW.Dificuldade IS NOT NULL THEN
            CASE NEW.Dificuldade
                WHEN 'facil' THEN SET mult_dific = 1;
                WHEN 'medio' THEN SET mult_dific = 2;
                WHEN 'dificil' THEN SET mult_dific = 4;
            END CASE;
        ELSE
            CASE OLD.Dificuldade
                WHEN 'facil' THEN SET mult_dific = 1;
                WHEN 'medio' THEN SET mult_dific = 2;
                WHEN 'dificil' THEN SET mult_dific = 4;
            END CASE;
        END IF;
        IF NEW.DataLimite != OLD.DataLimite OR NEW.Dificuldade != OLD.Dificuldade THEN
            UPDATE missao
            SET recompensa_moedas = 10 * mult_dific * dias_mult * mult_classem,
                recompensa_xp = 7 * mult_dific * dias_mult * mult_classex
            WHERE id = NEW.id;
        END IF;
    END IF;
END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `recompensa_missao` AFTER UPDATE ON `missao` FOR EACH ROW BEGIN
	DECLARE usuario_id INT;
    SELECT fk_usuario_id INTO usuario_id
    FROM usuario_missao
    WHERE fk_missao_id = NEW.id LIMIT 1;  
 IF !(NEW.completa = OLD.completa) THEN
      IF !(OLD.dificuldade is null) THEN
          IF (NEW.completa = 1) THEN
            UPDATE usuario SET moedas = moedas + new.recompensa_moedas, experiencia = experiencia + new.recompensa_xp where id = usuario_id;
          ELSE
            UPDATE usuario SET moedas = moedas - new.recompensa_moedas, experiencia = experiencia - new.recompensa_xp where id = usuario_id;
          END IF;
      END IF;
   END IF;
END
$$
DELIMITER ;

CREATE TABLE `tarefa` (
  `Nome` varchar(60) DEFAULT NULL,
  `Descricao` varchar(60) DEFAULT NULL,
  `DataLimite` date DEFAULT NULL,
  `DataCriacao` date DEFAULT NULL,
  `Dificuldade` varchar(15) DEFAULT NULL,
  `Feita` tinyint(1) DEFAULT NULL,
  `ID` int(11) NOT NULL,
  `fk_Missao_ID` int(11) DEFAULT NULL,
  `fk_Usuario_ID` int(11) DEFAULT NULL,
  `Recompensa_moedas` float DEFAULT NULL,
  `Recompensa_xp` float DEFAULT NULL);

DELIMITER $$
CREATE TRIGGER `atualizarMoedasXP` AFTER UPDATE ON `tarefa` FOR EACH ROW BEGIN
 IF !(NEW.feita = OLD.feita) THEN
      IF !(OLD.dificuldade is null) THEN
          IF (NEW.feita = 1) THEN
            UPDATE usuario SET moedas = moedas + new.recompensa_moedas, experiencia = experiencia + new.recompensa_xp where id = new.fk_usuario_id;
          ELSE
            UPDATE usuario SET moedas = moedas - new.recompensa_moedas, experiencia = experiencia - new.recompensa_xp where id = new.fk_usuario_id;
          END IF;
      END IF;
   END IF;
END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `marcar_missoes_completas_vida_boss` AFTER UPDATE ON `tarefa` FOR EACH ROW BEGIN
    DECLARE qtd_tarefas INT;
    DECLARE qtd_tarefas_feitas INT;
    SELECT COUNT(id) INTO qtd_tarefas
    FROM tarefa
    WHERE fk_missao_id = OLD.fk_missao_id;
    SELECT COUNT(id) INTO qtd_tarefas_feitas
    FROM tarefa
    WHERE fk_missao_id = OLD.fk_missao_id AND feita = 1;
    IF (NEW.feita = 1) AND (OLD.fk_missao_id IS NOT NULL) THEN
        UPDATE missao set vida_boss = vida_boss - ((qtd_tarefas_feitas / qtd_tarefas) * 100)
        where id = old.fk_missao_id;
    ELSEIF (NEW.feita = 0) AND (OLD.feita = 1) AND (OLD.fk_missao_id IS NOT NULL) THEN
        UPDATE missao 
        SET vida_boss = vida_boss + ((qtd_tarefas_feitas / qtd_tarefas) *100)
        WHERE id = OLD.fk_missao_id;
    END IF;
    IF (qtd_tarefas = qtd_tarefas_feitas) THEN
    	UPDATE missao
    	SET completa = 1
    	WHERE id = OLD.fk_missao_id;
    END IF;
END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `mudarXP_Moedas_tarefas` BEFORE UPDATE ON `tarefa` FOR EACH ROW BEGIN
    DECLARE mult_dific INT;
    DECLARE interval_days INT;
    DECLARE dias_mult DOUBLE;
    DECLARE mult_classem DOUBLE;
    DECLARE mult_classex DOUBLE;
    DECLARE classe VARCHAR(16);
    IF !(OLD.dificuldade is null) THEN
        SELECT fk_classe_nome INTO classe
        FROM usuario
        WHERE id = NEW.fk_usuario_id;
        IF classe = 'tartaruga' THEN
            SET mult_classex = 1.5;
            SET mult_classem = 1;
        ELSEIF classe = 'jabuti' THEN
            SET mult_classem = 1.5;
            SET mult_classex = 1;
        ELSE
            SET mult_classem = 1;
            SET mult_classex = 1;
        END IF;
        SET interval_days = DATEDIFF(NEW.DataLimite, OLD.DataCriacao);
        IF interval_days <= 3 THEN
            SET dias_mult = 2.5;
        ELSEIF interval_days <= 15 THEN
            SET dias_mult = 1.5;
        ELSE
            SET dias_mult = 1;
        END IF;
        IF NEW.Dificuldade IS NOT NULL THEN
            CASE NEW.Dificuldade
                WHEN 'facil' THEN SET mult_dific = 1;
                WHEN 'medio' THEN SET mult_dific = 2;
                WHEN 'dificil' THEN SET mult_dific = 4;
            END CASE;
        ELSE
            CASE OLD.Dificuldade
                WHEN 'facil' THEN SET mult_dific = 1;
                WHEN 'medio' THEN SET mult_dific = 2;
                WHEN 'dificil' THEN SET mult_dific = 4;
            END CASE;
        END IF;
        IF NEW.DataLimite != OLD.DataLimite OR NEW.Dificuldade != OLD.Dificuldade THEN
            SET new.recompensa_moedas = 5 * mult_dific * dias_mult * mult_classem,
                new.recompensa_xp = 3 * mult_dific * dias_mult * mult_classex;
        END IF;
    END IF;
END
$$
DELIMITER ;

CREATE TABLE `usuario` (
  `ID` int(11) NOT NULL,
  `nome` varchar(60) DEFAULT NULL,
  `nome_heroico` varchar(60) DEFAULT NULL,
  `nivel` int(11) DEFAULT 1,
  `vida` float DEFAULT 100,
  `experiencia` float DEFAULT 0,
  `email` varchar(32) DEFAULT NULL,
  `senha` varchar(32) DEFAULT NULL,
  `moedas` float DEFAULT 0,
  `fk_Classe_nome` varchar(30) DEFAULT NULL);

CREATE TABLE `usuario_missao` (
  `fk_Usuario_ID` int(11) DEFAULT NULL,
  `fk_Missao_ID` int(11) DEFAULT NULL);


ALTER TABLE `classe`
  ADD PRIMARY KEY (`nome`);

ALTER TABLE `etiqueta`
  ADD PRIMARY KEY (`ID`);

ALTER TABLE `etiqueta_missao`
  ADD KEY `FK_etiqueta_missao_1` (`fk_Etiqueta_ID`),
  ADD KEY `FK_etiqueta_missao_2` (`fk_Missao_ID`);

ALTER TABLE `etiqueta_tarefa`
  ADD KEY `FK_etiqueta_tarefa_1` (`fk_Etiqueta_ID`),
  ADD KEY `FK_etiqueta_tarefa_2` (`fk_Tarefa_ID`);

ALTER TABLE `guilda`
  ADD PRIMARY KEY (`ID`);

ALTER TABLE `guilda_usuario`
  ADD KEY `FK_guilda_usuario_1` (`fk_Usuario_ID`),
  ADD KEY `FK_guilda_usuario_2` (`fk_Guilda_id`);

ALTER TABLE `hash`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_Hash_2` (`fk_email_usuario`);

ALTER TABLE `item`
  ADD PRIMARY KEY (`Nome`),
  ADD KEY `FK_item_2` (`fk_Classe_nome`);

ALTER TABLE `item_usuario`
  ADD KEY `FK_item_usuario_1` (`fk_Usuario_ID`),
  ADD KEY `FK_item_usuario_2` (`fk_Item_Nome`);

ALTER TABLE `missao`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_missao_2` (`fk_Guilda_id`);

ALTER TABLE `tarefa`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_tarefa_2` (`fk_Missao_ID`),
  ADD KEY `FK_tarefa_3` (`fk_Usuario_ID`);

ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `FK_usuario_2` (`fk_Classe_nome`);

ALTER TABLE `usuario_missao`
  ADD KEY `FK_usuario_missao_1` (`fk_Usuario_ID`),
  ADD KEY `FK_usuario_missao_2` (`fk_Missao_ID`);


ALTER TABLE `etiqueta`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `guilda`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `hash`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `missao`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `tarefa`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `usuario`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `etiqueta_missao`
  ADD CONSTRAINT `FK_etiqueta_missao_1` FOREIGN KEY (`fk_Etiqueta_ID`) REFERENCES `etiqueta` (`ID`),
  ADD CONSTRAINT `FK_etiqueta_missao_2` FOREIGN KEY (`fk_Missao_ID`) REFERENCES `missao` (`ID`);

ALTER TABLE `etiqueta_tarefa`
  ADD CONSTRAINT `FK_etiqueta_tarefa_1` FOREIGN KEY (`fk_Etiqueta_ID`) REFERENCES `etiqueta` (`ID`),
  ADD CONSTRAINT `FK_etiqueta_tarefa_2` FOREIGN KEY (`fk_Tarefa_ID`) REFERENCES `tarefa` (`ID`);

ALTER TABLE `guilda_usuario`
  ADD CONSTRAINT `FK_guilda_usuario_1` FOREIGN KEY (`fk_Usuario_ID`) REFERENCES `usuario` (`ID`),
  ADD CONSTRAINT `FK_guilda_usuario_2` FOREIGN KEY (`fk_Guilda_id`) REFERENCES `guilda` (`ID`);

ALTER TABLE `hash`
  ADD CONSTRAINT `FK_Hash_2` FOREIGN KEY (`fk_email_usuario`) REFERENCES `usuario` (`email`);

ALTER TABLE `item`
  ADD CONSTRAINT `FK_item_2` FOREIGN KEY (`fk_Classe_nome`) REFERENCES `classe` (`nome`);

ALTER TABLE `item_usuario`
  ADD CONSTRAINT `FK_item_usuario_1` FOREIGN KEY (`fk_Usuario_ID`) REFERENCES `usuario` (`ID`),
  ADD CONSTRAINT `FK_item_usuario_2` FOREIGN KEY (`fk_Item_Nome`) REFERENCES `item` (`Nome`);

ALTER TABLE `missao`
  ADD CONSTRAINT `FK_missao_2` FOREIGN KEY (`fk_Guilda_id`) REFERENCES `guilda` (`ID`);

ALTER TABLE `tarefa`
  ADD CONSTRAINT `FK_tarefa_2` FOREIGN KEY (`fk_Missao_ID`) REFERENCES `missao` (`ID`),
  ADD CONSTRAINT `FK_tarefa_3` FOREIGN KEY (`fk_Usuario_ID`) REFERENCES `usuario` (`ID`);

ALTER TABLE `usuario`
  ADD CONSTRAINT `FK_usuario_2` FOREIGN KEY (`fk_Classe_nome`) REFERENCES `classe` (`nome`);

ALTER TABLE `usuario_missao`
  ADD CONSTRAINT `FK_usuario_missao_1` FOREIGN KEY (`fk_Usuario_ID`) REFERENCES `usuario` (`ID`),
  ADD CONSTRAINT `FK_usuario_missao_2` FOREIGN KEY (`fk_Missao_ID`) REFERENCES `missao` (`ID`);


  DELIMITER $$
CREATE EVENT `aplicar_dano_missoes_atrasadas` ON SCHEDULE EVERY 1 DAY DO BEGIN  
   UPDATE usuario  
   JOIN (
       SELECT um.fk_usuario_id, 
              COALESCE(SUM(m.recompensa_xp) / 2, 0) AS dano  
       FROM usuario_missao um
       JOIN missao m ON um.fk_missao_id = m.id  
       WHERE m.DataLimite < NOW()
       AND um.completa = 0
       GROUP BY um.fk_usuario_id  
   ) AS missoes_atrasadas ON usuario.id = missoes_atrasadas.fk_usuario_id  
   SET usuario.vida = usuario.vida - 
       (CASE 
           WHEN usuario.fk_Classe_nome = 'cágado' THEN missoes_atrasadas.dano * 0.7
           ELSE missoes_atrasadas.dano
        END);
END$$

CREATE EVENT `regenerar_vida` ON SCHEDULE EVERY 1 DAY DO BEGIN  
   UPDATE usuario  
   SET vida = LEAST(vida + 10, 100); 
END$$

CREATE EVENT `aplicar_dano_tarefas_atrasadas` ON SCHEDULE EVERY 1 DAY DO BEGIN  
   UPDATE usuario  
   JOIN (
       SELECT fk_usuario_id, COALESCE(SUM(recompensa_xp) / 2, 0) AS dano  
       FROM tarefa  
       WHERE DataLimite < CURDATE() 
       AND feita = 0                  
       GROUP BY fk_usuario_id  
   ) AS tarefas_atrasadas ON usuario.id = tarefas_atrasadas.fk_usuario_id  
   SET usuario.vida = usuario.vida - 
       (CASE 
           WHEN usuario.fk_Classe_nome = 'cágado' THEN tarefas_atrasadas.dano * 0.7
           ELSE tarefas_atrasadas.dano
        END);
END$$

DELIMITER ;



