import {CellDefinition, TableColumnData} from '../table/table.component';

/**
 * return true when cellDefinition is in specific cellDefinition list
 * @param item cell definition
 * @param list cell definition list
 */
export function isCellDefinitionContainedInCellDefinitions(item: CellDefinition, list: CellDefinition[]) {
  return getIndexFromCellDefinitionList(item, list) !== -1;
}

/**
 * return index of cellDefinition in specific cellDefinition list
 * @param item cell definition
 * @param list cell definition list
 */
export function getIndexFromCellDefinitionList(item: CellDefinition, list: CellDefinition[]) {
  return list.findIndex(def => def.label === item.label && def.property === item.property);
}

/**
 * get children from columns with cell definition
 * @param cellDefinition cell definition
 * @param columns table column data
 */
export function getChildrenFromColumnsWithCellDefinition(cellDefinition: CellDefinition, columns: TableColumnData[] = []) {
  const children: TableColumnData[] = [];

  // make copy columns to avoid vanishing children data
  JSON.parse(JSON.stringify(columns)).forEach(column => {
    if (isSameWithCellDefinitionAndColumn(cellDefinition, column)) {
      children.push(...getChildrenFromColumn(column));
    }
  });

  return children;
}

/**
 * get children from column
 * @param column table column data
 */
export function getChildrenFromColumn(column: TableColumnData) {
  const children: TableColumnData[] = [];

  if (column.children && column.children.length) {
    column.children.forEach(child => {
      children.push(...getChildrenFromColumn(child));

      child.children = undefined;

      children.push(child);
    });
  }

  return children;
}

/**
 * return true when cell definition derived from specific column
 * @param cellDefinition cell definition
 * @param column column
 */
export function isSameWithCellDefinitionAndColumn(cellDefinition: CellDefinition, column: TableColumnData) {
  return cellDefinition.label === column.label && cellDefinition.property === column.property;
}

/**
 * return true when cell definition is one of columns
 * @param cellDefinition cell definition
 * @param columns columns
 */
export function isCellDefinitionContainedInColumns(cellDefinition: CellDefinition, columns: TableColumnData[]) {
  const index = columns.findIndex(column => isSameWithCellDefinitionAndColumn(cellDefinition, column));

  return index !== -1;
}

/**
 * return true when specific column is in the columns
 * @param column column
 * @param columns columns
 */
export function isColumnContainedInColumns(column: TableColumnData, columns: TableColumnData[]) {
  const index = columns.findIndex(item => isSameColumn(item, column));

  return index !== -1;
}

/**
 * return true when two columns are same
 * @param column1 column
 * @param column2 column
 */
export function isSameColumn(column1: TableColumnData, column2: TableColumnData) {
  return column1.label === column2.label && column1.property === column2.property;
}

/**
 * return true when column is parent of specific column
 * @param child child column
 * @param parent parent column
 */
export function isParentColumn(child: TableColumnData, parent: TableColumnData) {
  return (parent.children || []).findIndex(item => isSameColumn(child, item)) !== -1;
}

/**
 * return true when all item of columns1 is contained in columns2
 * @param columns1 columns
 * @param columns2 columns
 */
export function isColumnsContainedInColumns(columns1: TableColumnData[], columns2: TableColumnData[]) {
  return columns1.length === columns1.filter(column => isColumnContainedInColumns(column, columns2)).length;
}
