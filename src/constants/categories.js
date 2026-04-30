/**
 * Product categories structure
 * Defines main categories and their subcategories
 */
export const categoryStructure = {
  'PJU Tenaga Surya': ['All In One', 'Two In One', 'Konvensional'],
  'PJU PLN': [],
  'Pompa Air Tenaga Surya': [],
  'Traffic Light': [],
  'Warning Light': [],
  'Lampu Taman': [],
  'Solar Home System': [],
  'Aksesori': ['Solar Panel', 'Controller', 'Inverter', 'Baterai']
};

export const mainCategories = Object.keys(categoryStructure);

export const allCategories = ['Semua', ...mainCategories];
