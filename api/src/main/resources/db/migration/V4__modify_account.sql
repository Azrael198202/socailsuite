ALTER TABLE account ADD externalid text NULL;
ALTER TABLE account ADD avatarurl text NULL;
ALTER TABLE account ADD handle text NULL;
ALTER TABLE account ADD isdefault bool NULL;
ALTER TABLE account ADD expires_at timestamptz DEFAULT now() NULL;

CREATE TABLE
    IF NOT EXISTS account_scopes (
        account_id UUID NOT NULL REFERENCES account (id) ON DELETE CASCADE,
        scope TEXT NOT NULL,
        PRIMARY KEY (account_id, scope)
    );

