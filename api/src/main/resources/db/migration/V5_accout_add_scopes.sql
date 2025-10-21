CREATE TABLE
    IF NOT EXISTS account_scopes (
        account_id UUID NOT NULL REFERENCES account (id) ON DELETE CASCADE,
        scope TEXT NOT NULL,
        PRIMARY KEY (account_id, scope)
    );