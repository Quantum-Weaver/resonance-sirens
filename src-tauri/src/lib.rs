// ============================================================================
// SIRENS — the Rust side
// ============================================================================
//
// One migration, one table. The database URL here must match src/lib/record.ts
// exactly ("sqlite:siren.db"), because nothing checks that for us.
//
// THE JNI LAW, from resonance-standards/docs/ANDROID-BUILD-LAWS.md §2:
// non-ASCII in a SQL DEFAULT value fails SILENTLY through the Rust JNI bridge
// on Android — nothing errors, nothing logs, the migration simply does not
// land the way the source reads. So there is no DEFAULT here carrying a symbol,
// and there never will be: every emoji in this app is written from application
// code. The schema below is deliberately ASCII to the last byte.
//
// AND THE SHAPE LAW, which is the app's whole promise: no cycle table, no phase
// table, no prediction table. A cycle is derived from moments at read time and
// never stored, because a stored cycle is a judgement about her body that
// outlives the day it was made.

use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "the moments table - one press, one row",
        sql: "CREATE TABLE IF NOT EXISTS moments (
                id      TEXT PRIMARY KEY NOT NULL,
                at      TEXT NOT NULL,
                emoji   TEXT NOT NULL,
                temp_c  REAL,
                note    TEXT
              );
              CREATE INDEX IF NOT EXISTS moments_at ON moments (at DESC);",
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:siren.db", migrations)
                .build(),
        )
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
