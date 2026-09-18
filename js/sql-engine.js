// js/sql-engine.js

/**
 * SQL Engine - Wrapper para SQL.js (SQLite en WebAssembly)
 */

/**
 * Registro de datasets por módulo. Añadir un módulo nuevo es agregar
 * una línea aquí — ya no hay que tocar loadModuleDataset().
 */
const MODULE_DATASET_LOADERS = {
  1: () => import('../data/module1-dataset.js').then(m => m.module1Dataset),
  2: () => import('../data/module2-dataset.js').then(m => m.module2Dataset),
  3: () => import('../data/module3-dataset.js').then(m => m.module3Dataset),
  4: () => import('../data/module4-dataset.js').then(m => m.module4Dataset),
  5: () => import('../data/module5-dataset.js').then(m => m.module5Dataset),
  6: () => import('../data/module6-dataset.js').then(m => m.module6Dataset),
  7: () => import('../data/module7-dataset.js').then(m => m.module7Dataset),
  8: () => import('../data/module8-dataset.js').then(m => m.module8Dataset),
  9: () => import('../data/module9-dataset.js').then(m => m.module9Dataset),
  10: () => import('../data/module10-dataset.js').then(m => m.module10Dataset)
};

export class SQLEngine {
  constructor() {
    this.db = null;
    this.ready = false;
    this.error = null;
    this.SQL = null;
  }

  async init() {
    try {
      if (typeof initSqlJs === 'undefined') {
        throw new Error('SQL.js no está disponible. Revisa el script sql-wasm.js.');
      }

      if (!this.ready || !this.db) {
        const SQL = await initSqlJs({
          locateFile: file => `https://sql.js.org/dist/${file}`
        });

        this.SQL = SQL;
        this.db = new SQL.Database();
        this.ready = true;
        console.log('✅ SQL.js inicializado correctamente');
      }

      return this;
    } catch (err) {
      this.error = err.message;
      console.error('❌ Error al inicializar SQL.js:', err);
      throw err;
    }
  }

  exec(sqlQuery) {
    if (!this.ready || !this.db) {
      return {
        success: false,
        data: null,
        error: 'SQL Engine no está listo.'
      };
    }

    try {
      const result = this.db.exec(sqlQuery);

      if (!result || result.length === 0) {
        return {
          success: true,
          data: [],
          error: null
        };
      }

      return {
        success: true,
        data: result,
        error: null
      };
    } catch (err) {
      return {
        success: false,
        data: null,
        error: err.message
      };
    }
  }

  run(sqlQuery) {
    if (!this.ready || !this.db) {
      throw new Error('SQL Engine no está listo.');
    }

    this.db.run(sqlQuery);
  }

  /**
   * Cargar dataset dinámicamente para cualquier módulo registrado
   * en MODULE_DATASET_LOADERS.
   */
  async loadModuleDataset(moduleId) {
    if (!this.ready || !this.db) {
      throw new Error('SQL Engine no está listo');
    }

    const loadDataset = MODULE_DATASET_LOADERS[moduleId];
    if (!loadDataset) {
      throw new Error(`No hay dataset registrado para el módulo ${moduleId}. Agrégalo a MODULE_DATASET_LOADERS en sql-engine.js.`);
    }

    try {
      const moduleDataset = await loadDataset();

      // Limpiar DB del módulo anterior
      this.clearDatabase();

      // Crear tablas
      for (const [tableName, tableSchema] of Object.entries(moduleDataset.tables)) {
        const columns = tableSchema.columns
          .map(col => {
            let def = `${col.name} ${col.type}`;
            if (col.isPK) def += ' PRIMARY KEY';
            return def;
          })
          .join(', ');

        this.db.run(`CREATE TABLE ${tableName} (${columns});`);
      }

      // Poblar datos
      if (moduleDataset.populateSql) {
        this.db.run(moduleDataset.populateSql);
      }

      console.log(`✅ Dataset del Módulo ${moduleId} cargado`);
    } catch (err) {
      console.error(`❌ Error al cargar Módulo ${moduleId}:`, err);
      throw err;
    }
  }

  /**
   * Limpiar base de datos
   */
  clearDatabase() {
    if (!this.ready || !this.db) return;

    try {
      const tables = this.db.exec("SELECT name FROM sqlite_master WHERE type='table';");
      if (tables && tables[0]) {
        tables[0].values.forEach(row => {
          this.db.run(`DROP TABLE IF EXISTS ${row[0]};`);
        });
      }
      console.log('✅ Base de datos limpiada');
    } catch (err) {
      console.warn('⚠️ Error al limpiar BD:', err);
    }
  }
}
