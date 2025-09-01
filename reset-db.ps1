# This PowerShell script will delete all data from the SQLite database tables for a clean slate.
# It assumes the database file is at .\app\hobby.db and sqlite3.exe is available in PATH.

$ErrorActionPreference = 'Stop'

$sql = @'
delete from hobby;
delete from field;
delete from combo_option;
delete from item;
delete from item_value;
'@

# Path to the SQLite database
$dbPath = Join-Path $PSScriptRoot 'app\hobby.db'

# Run the SQL using sqlite3
sqlite3 "$dbPath" "$sql"
