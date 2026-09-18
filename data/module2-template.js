// data/module2-dataset.js
/**
 * Módulo 2 - SELECT Fundamentals
 * TEMPLATE - Copiar y modificar para cada módulo
 */

export const module2Metadata = {
  id: 2,
  title: 'SELECT Fundamentals',
  displayTitle: 'SQL Explorer',
  emoji: '🔍',
  range: '🔍 SQL Explorer',
  totalChallenges: 3
};

export const module2Dataset = {
  tables: {
    products: {
      columns: [
        { name: 'id', type: 'INTEGER', isPK: true },
        { name: 'name', type: 'TEXT' },
        { name: 'price', type: 'REAL' },
        { name: 'category', type: 'TEXT' }
      ],
      rowCount: 5
    }
  },
  populateSql: `
    INSERT INTO products (id, name, price, category) VALUES
    (1, 'Laptop', 999.99, 'Electronics'),
    (2, 'Mouse', 29.99, 'Electronics'),
    (3, 'Desk Chair', 199.99, 'Furniture'),
    (4, 'Monitor', 349.99, 'Electronics'),
    (5, 'Keyboard', 79.99, 'Electronics');
  `
};

export const module2Challenges = [
  {
    id: 1,
    title: 'Todos los productos',
    description: 'Selecciona todos los productos de la tabla.',
    difficulty: 1,
    tables: ['products'],
    thinking: {
      question1: 'Todos los productos',
      question2: 'products',
      question3: 'Todas las columnas'
    },
    hints: [
      'Necesitas obtener todos los registros',
      'Todos los campos de cada registro',
      'SELECT * FROM products;'
    ],
    validator: (data, query) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const isCorrect = table.values.length === 5 && table.columns.length === 4;
      return {
        passed: isCorrect,
        message: '¡Correcto!',
        feedback: 'Obtuviste todos los productos.'
      };
    }
  },
  {
    id: 2,
    title: 'Nombres y precios',
    description: 'Selecciona solo el nombre y precio de cada producto.',
    difficulty: 2,
    tables: ['products'],
    thinking: {
      question1: 'Nombres y precios',
      question2: 'products',
      question3: 'Columnas name y price'
    },
    hints: [
      'Necesitas dos columnas específicas',
      'name y price',
      'SELECT col1, col2 FROM tabla;'
    ],
    validator: (data, query) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const isCorrect = 
        table.columns.length === 2 &&
        table.columns.includes('name') &&
        table.columns.includes('price');
      return {
        passed: isCorrect,
        message: '¡Perfecto!',
        feedback: 'Seleccionaste correctamente dos columnas.'
      };
    }
  },
  {
    id: 3,
    title: 'Productos electrónicos',
    description: 'Selecciona todos los productos de la categoría "Electronics".',
    difficulty: 2,
    tables: ['products'],
    thinking: {
      question1: 'Productos de una categoría',
      question2: 'products',
      question3: 'Todos, pero filtrados'
    },
    hints: [
      'Necesitas filtrar por categoría',
      'WHERE category = ...',
      'WHERE category = \'Electronics\''
    ],
    validator: (data, query) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const isCorrect = table.values.length === 4; // 4 electronic products
      return {
        passed: isCorrect,
        message: '¡Excelente!',
        feedback: 'Filtraste correctamente los productos electrónicos.'
      };
    }
  }
];
