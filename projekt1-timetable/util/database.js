import sqlite from "sqlite3";

const db = new sqlite.Database("./data/database.sqlite");

export function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
export function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}
export function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}
export async function initializeDatabase() {
    await dbRun(
        "CREATE TABLE IF NOT EXISTS timetable (id INTEGER PRIMARY KEY AUTOINCREMENT, date STRING, hour INTEGER, subject STRING)"
    );
    const rows = await dbAll("SELECT * FROM timetable");
    if (rows.length === 0) {
        await dbRun(
            "INSERT INTO timetable (date, hour, subject) VALUES ('Monday', 8, 'Math')"
        );
    }
}
export async function resetIds() {
    // Step 1: Copy remaining rows to a temporary table
    await dbRun("CREATE TABLE temp_timetable AS SELECT date, hour, subject FROM timetable");

    // Step 2: Drop the original table
    await dbRun("DROP TABLE timetable");

    // Step 3: Recreate the original table
    await dbRun(
        "CREATE TABLE timetable (id INTEGER PRIMARY KEY AUTOINCREMENT, date STRING, hour INTEGER, subject STRING)"
    );

    // Step 4: Copy data back to the original table
    await dbRun("INSERT INTO timetable (date, hour, subject) SELECT date, hour, subject FROM temp_timetable");

    // Step 5: Drop the temporary table
    await dbRun("DROP TABLE temp_timetable");
}