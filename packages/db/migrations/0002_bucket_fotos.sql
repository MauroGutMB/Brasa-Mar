-- Bucket das fotos enviadas pelo admin (pratos, hero, buffet).
--
-- Público para leitura, porque as imagens aparecem no site e passam pelo
-- next/image. A escrita é sempre pelo servidor, com a service role key, que
-- ignora RLS — por isso não há policy de INSERT aqui.
--
-- Só roda num banco Supabase; em Postgres puro o schema storage não existe e
-- o bloco é ignorado.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('fotos', 'fotos', true)
    ON CONFLICT (id) DO UPDATE SET public = true;
  END IF;
END $$;
