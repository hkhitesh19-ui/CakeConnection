-- ============================================
-- SQL Migration: AI-Powered Search System
-- ============================================

-- 1. Enable pg_trgm extension for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Add search vector column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- 3. Populate existing products search vectors
UPDATE products SET search_vector = 
  setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'C') ||
  setweight(to_tsvector('english', coalesce(flavour, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(subcategory, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'B');

-- 4. Create trigger function to automatically compute search vector on insert/update
CREATE OR REPLACE FUNCTION update_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.flavour, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.subcategory, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Drop trigger if it exists and recreate it
DROP TRIGGER IF EXISTS trg_products_search_vector ON products;
CREATE TRIGGER trg_products_search_vector
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- 6. Create GIN index for search_vector for extremely fast full-text searches
CREATE INDEX IF NOT EXISTS idx_products_search_vector ON products USING GIN(search_vector);

-- 7. Create GIN index on product name using pg_trgm for typo tolerance & fuzzy queries
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING GIN(name gin_trgm_ops);

-- 8. Smart product search RPC function (takes query & filters, calculates similarity score)
CREATE OR REPLACE FUNCTION search_products(
  search_query TEXT,
  category_filter TEXT DEFAULT NULL,
  min_price NUMERIC DEFAULT NULL,
  max_price NUMERIC DEFAULT NULL,
  tags_filter TEXT[] DEFAULT NULL,
  is_bestseller_filter BOOLEAN DEFAULT NULL,
  is_eggless_filter BOOLEAN DEFAULT NULL,
  result_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  name TEXT,
  short_description TEXT,
  category TEXT,
  subcategory TEXT,
  flavour TEXT,
  tags TEXT[],
  is_available BOOLEAN,
  is_featured BOOLEAN,
  is_bestseller BOOLEAN,
  is_new_arrival BOOLEAN,
  rating NUMERIC,
  review_count INTEGER,
  relevance_score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id, p.slug, p.name, p.short_description,
    p.category, p.subcategory, p.flavour, p.tags,
    p.is_available, p.is_featured, p.is_bestseller, p.is_new_arrival,
    p.rating, p.review_count,
    (
      COALESCE(ts_rank_cd(p.search_vector, plainto_tsquery('english', search_query)), 0) * 2 +
      COALESCE(similarity(p.name, search_query), 0) * 3 +
      COALESCE(word_similarity(search_query, p.name), 0) * 2
    )::REAL AS relevance_score
  FROM products p
  LEFT JOIN product_variants pv ON pv.product_id = p.id
  WHERE p.is_available = true
    AND (
      p.search_vector @@ plainto_tsquery('english', search_query)
      OR similarity(p.name, search_query) > 0.15
      OR p.name ILIKE '%' || search_query || '%'
      OR p.flavour ILIKE '%' || search_query || '%'
      OR search_query = ANY(p.tags)
    )
    AND (category_filter IS NULL OR p.category = category_filter)
    AND (min_price IS NULL OR pv.price >= min_price)
    AND (max_price IS NULL OR pv.price <= max_price)
    AND (tags_filter IS NULL OR p.tags && tags_filter)
    AND (is_bestseller_filter IS NULL OR p.is_bestseller = is_bestseller_filter)
    AND (is_eggless_filter IS NULL OR 'eggless' = ANY(p.tags))
  GROUP BY p.id
  ORDER BY relevance_score DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;
