BEGIN
 IF !(NEW.feita = OLD.feita) THEN
      IF !(OLD.dificuldade = 0) THEN
          IF (NEW.feita = 1) THEN
            UPDATE usuario SET moedas = moedas + new.recompensa_moedas, experiencia = experiencia + new.recompensa_xp where id = new.fk_usuario_id;
          ELSE
            UPDATE usuario SET moedas = moedas - new.recompensa_moedas, experiencia = experiencia - new.recompensa_xp where id = new.fk_usuario_id;
          END IF;
      END IF;
   END IF;
END

BEGIN
    DECLARE mult_dific INT;
    DECLARE interval_days INT;
    DECLARE dias_mult DOUBLE;
    DECLARE mult_classem DOUBLE;
    DECLARE mult_classex DOUBLE;
    DECLARE classe VARCHAR(16);
    IF !(OLD.dificuldade = 0) THEN
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