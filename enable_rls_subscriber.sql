-- 1. Habilitar RLS en la tabla Subscriber
ALTER TABLE "public"."Subscriber" ENABLE ROW LEVEL SECURITY;

-- 2. Permitir que cualquiera (anon y auth) pueda INSERTAR (Suscribirse)
-- Sin esta política, nadie podría suscribirse.
CREATE POLICY "Permitir insertar a cualquiera" 
ON "public"."Subscriber" 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 3. Permitir SOLO a usuarios autenticados VER la lista (Admin)
-- Esto protege los emails de miradas públicas.
CREATE POLICY "Solo admins pueden ver" 
ON "public"."Subscriber" 
FOR SELECT 
TO authenticated 
USING (true);

-- 4. Permitir SOLO a usuarios autenticados BORRAR (Admin)
CREATE POLICY "Solo admins pueden borrar" 
ON "public"."Subscriber" 
FOR DELETE 
TO authenticated 
USING (true);
