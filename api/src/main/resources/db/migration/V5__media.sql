CREATE TABLE IF NOT EXISTS
    media_file (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        filename TEXT,
        contentType TEXT,
        size bigint,
        storagePath TEXT,
        created_at TIMESTAMPTZ DEFAULT now ()
    );