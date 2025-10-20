/* Basic tables */
CREATE TABLE
    account (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        platform VARCHAR(32) NOT NULL,
        name VARCHAR(128) NOT NULL,
        access_token TEXT,
        refresh_token TEXT,
        connected BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT now (),
        updated_at TIMESTAMPTZ DEFAULT now ()
    );

CREATE TABLE
    scheduled_post (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        title VARCHAR(256) NOT NULL,
        platform VARCHAR(32) NOT NULL,
        date DATE NOT NULL,
        description TEXT,
        tags TEXT,
        status VARCHAR(16) NOT NULL DEFAULT 'PENDING',
        created_at TIMESTAMPTZ DEFAULT now (),
        updated_at TIMESTAMPTZ DEFAULT now ()
    );