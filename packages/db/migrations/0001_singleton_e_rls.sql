-- site_settings é uma linha só: a constraint impede que exista uma segunda
-- linha divergente, seja por bug ou por edição manual no painel do Supabase.
ALTER TABLE "site_settings"
  ADD CONSTRAINT "site_settings_linha_unica" CHECK ("id" = 1);
--> statement-breakpoint

-- Todo acesso ao banco é feito pelo servidor, com a connection string.
-- Ligar RLS sem criar nenhuma policy nega tudo para as chaves anon e
-- authenticated do Supabase; a service_role e o dono do banco ignoram RLS.
ALTER TABLE "site_settings" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "opening_hours" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "dishes" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "admin_users" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

-- Ordenação do cardápio e busca por slug são as duas leituras quentes.
CREATE INDEX "dishes_position_idx" ON "dishes" ("position");
--> statement-breakpoint

-- Apagar o usuário no Supabase Auth tira o acesso junto, sem deixar órfão.
-- A FK só existe quando o schema auth existe (ou seja, num banco Supabase);
-- num Postgres puro o bloco é ignorado.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'auth') THEN
    ALTER TABLE "admin_users"
      ADD CONSTRAINT "admin_users_id_auth_users_fk"
      FOREIGN KEY ("id") REFERENCES auth.users("id") ON DELETE CASCADE;
  END IF;
END $$;
