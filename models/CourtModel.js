import Database from "better-sqlite3";

export class CourtModel {
  constructor() {
    // Initialize the database connection
    this.db = new Database("./db/bball.db");
    // this.db = new Database("./src/db/bball.db", { verbose: console.log });

    // Ensure the court table exists
    this.db
      .prepare(
        `
      CREATE TABLE IF NOT EXISTS court (
        court_id INTEGER PRIMARY KEY AUTOINCREMENT,
        court_name TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT DEFAULT 'active'
      )
    `
      )
      .run();
  }

  // Create a new court
  create(court_name, location, status = "active") {
    const query = `
      INSERT INTO court (court_name, location, status)
      VALUES (?, ?, ?)
    `;
    const result = this.db.prepare(query).run(court_name, location, status);

    return {
      id: result.lastInsertRowid,
      court_name,
      location,
      status,
    };
  }

  // Read all courts
  findAll() {
    const query = `
      SELECT * FROM court LIMIT 10
    `;
    const rows = this.db.prepare(query).all();
    return rows;
  }

  // Find a court by ID
  findById(id) {
    const query = `
      SELECT * FROM court WHERE court_id = ?
    `;
    const row = this.db.prepare(query).get(id);
    return row || null; // Return null if no court is found
  }

  // Update a court by ID
  update(id, court_name, location, status) {
    const query = `
      UPDATE court
      SET court_name = ?, location = ?, status = ?
      WHERE court_id = ?
    `;
    const result = this.db.prepare(query).run(court_name, location, status, id);

    if (result.changes === 0) {
      throw new Error("No court found with that ID");
    }

    return {
      id,
      court_name,
      location,
      status,
    };
  }

  // Delete a court by ID
  delete(id) {
    const query = `
      DELETE FROM court WHERE court_id = ?
    `;
    const result = this.db.prepare(query).run(id);

    if (result.changes === 0) {
      throw new Error("No court found with that ID");
    }

    return { message: "Court deleted successfully" };
  }

  // Close the database connection
  close() {
    this.db.close();
    console.log("Database connection closed.");
  }
}

// Example usage
// const courtModel = new CourtModel();
// courtModel.create('Main Court', 'City Center');
// console.log(courtModel.findAll());
// courtModel.update(1, 'Updated Court', 'New Location', 'inactive');
// console.log(courtModel.findById(1));
// courtModel.delete(1);
// courtModel.close();
