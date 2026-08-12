-- Categorias de prato deixam de ser um enum fixo e viram tabela editável.
--
-- Escrita à mão porque o drizzle-kit trocaria a coluna sem migrar os dados —
-- e aqui os pratos existentes precisam continuar apontando para a mesma
-- categoria depois da mudança.

CREATE TABLE "dish_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(60) NOT NULL,
	"color" varchar(7) DEFAULT '#e2571f' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

ALTER TABLE "dish_categories" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

-- As três categorias que existiam no enum, com as cores que estavam
-- hardcoded no componente do card.
INSERT INTO "dish_categories" ("name", "color", "position") VALUES
	('Carnes',       '#e2571f', 0),
	('Mar',          '#4e8cb4', 1),
	('Para dividir', '#f2ebdd', 2);
--> statement-breakpoint

ALTER TABLE "dishes" ADD COLUMN "category_id" uuid;
--> statement-breakpoint

-- Liga cada prato à categoria equivalente, casando o valor antigo do enum
-- com o nome novo.
UPDATE "dishes" SET "category_id" = (
	SELECT "id" FROM "dish_categories"
	WHERE "name" = CASE "dishes"."tag"::text
		WHEN 'carnes'       THEN 'Carnes'
		WHEN 'mar'          THEN 'Mar'
		WHEN 'para-dividir' THEN 'Para dividir'
	END
);
--> statement-breakpoint

-- Rede de segurança: se algum prato ficasse sem categoria, o NOT NULL abaixo
-- falharia e a migration inteira seria revertida em vez de perder o dado.
ALTER TABLE "dishes" ALTER COLUMN "category_id" SET NOT NULL;
--> statement-breakpoint

ALTER TABLE "dishes" ADD CONSTRAINT "dishes_category_id_dish_categories_id_fk"
	FOREIGN KEY ("category_id") REFERENCES "dish_categories"("id") ON DELETE RESTRICT;
--> statement-breakpoint

CREATE INDEX "dishes_category_idx" ON "dishes" ("category_id");
--> statement-breakpoint

ALTER TABLE "dishes" DROP COLUMN "tag";
--> statement-breakpoint

DROP TYPE "dish_tag";
