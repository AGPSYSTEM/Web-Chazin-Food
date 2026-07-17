const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'chazinfood' });
  try {
    console.log('Altering insumo table...');
    try {
      await conn.query('ALTER TABLE insumo ADD COLUMN estado TINYINT(1) DEFAULT 1');
      console.log('Added estado to insumo');
    } catch(e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('estado already exists in insumo');
      else throw e;
    }

    console.log('Altering insumopreparado table...');
    try {
      await conn.query('ALTER TABLE insumopreparado ADD COLUMN estado TINYINT(1) DEFAULT 1');
      console.log('Added estado to insumopreparado');
    } catch(e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('estado already exists in insumopreparado');
      else throw e;
    }

    console.log('Done.');
  } catch(e) {
    console.error(e);
  } finally {
    await conn.end();
  }
}
run();
